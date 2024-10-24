import torch
from audiocraft.models import MusicGen
import time
import os.path
from audiocraft.data.audio import audio_write
from tempfile import NamedTemporaryFile
from concurrent.futures import ProcessPoolExecutor
from random import randrange, choice
import typing as tp
from pathlib import Path

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
    print("new batch", len(texts), texts, [None if m is None else (m[0], m[1].shape) for m in melodies])
    be = time.time()

    outputs = outputs.detach().cpu().float()
    out_wavs = []
    for output in outputs:
        with NamedTemporaryFile("wb", suffix=".wav", delete=False) as file:
            audio_write(
                file.name, output, MODEL.sample_rate, strategy="loudness",
                loudness_headroom_db=16, loudness_compressor=True, add_suffix=False)
            out_wavs.append(file.name)
            file_cleaner.add(file.name)
    print("batch finished", len(texts), time.time() - be)
    print("Tempfiles currently stored: ", len(file_cleaner.files))
    return out_wavs

for beat_count in GENERATE_BEATS:
    file_name = "beat" + beat_count + ".wav"
    if os.path.isfile(file_name):
        print("\033[91mFile " + file_name + " already exists!\033[0m")
        continue
    duration = 10 #randrange(160, 300)
    prompt = choice(population=prompts.keys(), weights=prompts.values())
    wavs = _do_predictions(
        [prompt], duration, top_k=topk, top_p=topp,
        temperature=1, cfg_coef=3)
    
    with open(file_name, "w") as f:
        f.write(wavs[0])
