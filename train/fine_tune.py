#!/usr/bin/env python3

import gdown
from zipfile import ZipFile
import shutil
import subprocess
import sys
import json
import os

# generate a json metadata file for each audio entry in the dataset
def generate_json_metadata(dataset_name, artist):
    songs = {}
    with open(f"./egs/tmp/data_{"_".join(dataset_name.split(" ")).lower()}.jsonl") as songs_data:
        #print(songs_data.read())
        songs_json = list(filter(lambda s: s != "", songs_data.read().split("\n")))
    #     print(songs_json)
        songs = list(map(lambda s: json.loads(s), songs_json))
    # print(songs)

    for filename in os.listdir(f"./data/{dataset_name}/"):
        if not filename.endswith(".mp3"):
            print("skipping " + filename + "...")
            continue
        song_info = list(filter(lambda s: s["path"].endswith(filename), songs))[0]
        file_info = {"key": "", "artist": artist, "sample_rate": song_info["sample_rate"], "file_extension": "mp3", "description": "A cool beat by " + artist, "keywords": "beat, hiphop, hip-hop, hip hop, rap, bass", "duration": song_info["duration"], "bpm": "", "genre": "hip hop", "title": filename, "name": filename[:-4], "instrument": "Mix", "moods": [artist.lower(), "hip hop"]}
        with open(f"./data/{dataset_name}/" + filename[:-4] + ".json", "w") as json_file:
            json_file.write(json.dumps(file_info))

# download audio files to be used in the dataset
url = "https://drive.google.com/uc?id=1pFgX8UtrjTmtdCGJkxmhrQJTXt2H8xOD"
gdown.download(url, "imuno.zip")

with ZipFile("./imuno.zip", 'r') as zip_file:
    zip_file.extractall("./data/")

try:
    subprocess.check_call(["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
except:
    print("\n\nMake sure you have ffmpeg installed.")
    print("     sudo apt-get install ffmpeg")
    sys.exit(-1)

shutil.move("data/", "audiocraft/data/")

os.chdir("audiocraft/")

with open("config/dset/audio/custom.yaml", 'w') as f:
    f.write("""# @package __global__

datasource:
  max_sample_rate: 48000
  max_channels: 2

  train: egs/custom
  valid: egs/custom
  evaluate: egs/custom
  generate: egs/custom
""")

subprocess.check_call([sys.executable, "-m", "pip", "install", "torch==2.1.0"])
subprocess.check_call([sys.executable, "-m", "pip", "install", "setuptools wheel"])
subprocess.check_call([sys.executable, "-m", "pip", "install", "-e", "."])

subprocess.check_call([sys.executable, "-m", "audiocraft.data.audio_dataset", "data/Beat Hype", "egs/tmp/data_beat_hype.jsonl"])

generate_json_metadata("Beat Hype", "Imuno")
# TODO: add more data sources

# concatenate all existing dataset information in a single data.jsonl file that will be used by dora
with open("egs/custom/data.jsonl", "w") as data, open("egs/tmp/data_beat_hype.jsonl", "w") as ds1:
    data.write(ds1.read())

shutil.move("data/Beat Hype", "data/")

env = os.environ.copy()
# env["USER"] = "<user name>" # I needed to add this when testing in colab and kaggle
env["HYDRA_FULL_ERROR"] = "1"
# fine tune the model
subprocess.check_call(["dora", "run", "-d", "solver=musicgen/musicgen_base_32khz_custom.yaml", "model/lm/model_scale=small", "continue_from=//pretrained/facebook/musicgen-small", "conditioner=text2music", "dset=audio/custom"], env=env)

# NOTE: You can use this command to restart training from a checkpoint:
#  USER=root HYDRA_FULL_ERROR=1 dora run -d solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=/tmp/audiocraft_root/xps/29c15616/checkpoint.th conditioner=text2music dset=audio/custom

sys.exit(0)

# export the model
# first, in order to get the model signature, run:
#  dora info solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=//pretrained/facebook/musicgen-small conditioner=text2music dset=audio/custom
#  (based on the command you used for fine-tuning)

# TODO
