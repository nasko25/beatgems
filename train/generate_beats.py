import torch
from audiocraft.models import MusicGen
import time
import os.path
from audiocraft.data.audio import audio_write
from tempfile import NamedTemporaryFile
from concurrent.futures import ProcessPoolExecutor
from random import randrange, choices
import typing as tp
from pathlib import Path
from datetime import datetime

# prompt:probability
# NOTE: only positive probabilities allowed
prompts = {"hip-hop beat": 1}

# how many beats to generate
GENERATE_BEATS = 2

pool = ProcessPoolExecutor(4)
pool.__enter__()

sum_probs = sum(prompts[prompt] for prompt in prompts)

# normalize probabilities
for prompt in prompts:
    prompts[prompt] = float(prompts[prompt]) / sum_probs

class FileCleaner:
    def __init__(self, file_lifetime: float = 3600):
        self.file_lifetime = file_lifetime
        self.files = []

    def add(self, path: tp.Union[str, Path]):
        self._cleanup()
        self.files.append((time.time(), Path(path)))

    def _cleanup(self):
        now = time.time()
        for time_added, path in list(self.files):
            if now - time_added > self.file_lifetime:
                if path.exists():
                    path.unlink()
                self.files.pop(0)
            else:
                break

file_cleaner = FileCleaner()

model_path = "./checkpoints/my_audio_lm/"

if not os.path.isdir(model_path) \
        or not os.path.isfile(model_path + "state_dict.bin") \
        or not os.path.isfile(model_path + "compression_state_dict.bin"):
    raise Exception("Model " + model_path + " is missing. Make sure you have the latest fine-tuned model available.")

topk = 400
topp = 0.9
torch.cuda.empty_cache()

MODEL = MusicGen.get_pretrained(model_path)

def _do_predictions(texts, duration, **gen_kwargs):
    MODEL.set_generation_params(duration=duration, **gen_kwargs)
    print("new batch", len(texts), texts)
    be = time.time()

    try:
        outputs = MODEL.generate(texts, return_tokens=False)
    except RuntimeError as e:
        raise Exception("Error while generating " + e.args[0])

    outputs = outputs.detach().cpu().float()
    if len(outputs) != 1:
        raise Exception("unexpected length for outputs: {}".format(len(outputs)))

    print("batch finished", len(texts), time.time() - be)
    print("Tempfiles currently stored: ", len(file_cleaner.files))
    return outputs[0]

all_prompts = list(prompts.keys())
prompt_weights = list(prompts.values())
for beat_count in range(GENERATE_BEATS):
    prompt = choices(population=all_prompts, weights=prompt_weights, k=1)[0]
    prompt_idx = all_prompts.index(prompt)
    file_name = "beat{}_{}.wav".format(beat_count, prompt_idx)
    if os.path.isfile(file_name):
        print("\033[91mFile " + file_name + " already exists!\033[0m")
        continue
    print("Generating beat {}/{}".format(beat_count + 1, GENERATE_BEATS))
    duration = randrange(140, 210)
    output = _do_predictions(
        [prompt], duration, top_k=topk, top_p=topp,
        temperature=1, cfg_coef=3)
    
    print("Beat {} done".format(beat_count + 1))
    print("Saving to file {}...".format(file_name))
    with open(file_name, "wb") as f:
        audio_write(
                file_name, output, MODEL.sample_rate, strategy="loudness",
                loudness_headroom_db=16, loudness_compressor=True, add_suffix=False)
        print("{} saved at {}".format(file_name, datetime.now()))
