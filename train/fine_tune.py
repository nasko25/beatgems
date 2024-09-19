#!/usr/bin/env python3

import gdown
from zipfile import ZipFile
import shutil
import subprocess
import sys
import json
import os, errno

class DatasetEntry:
    def __init__(self, url, name, artist):
        self.url = url
        self.name = name
        self.artist = artist
    
    def get_file_name(self):
        return "_".join(self.name.split(" ")).lower()

# generate a json metadata file for each audio entry in the dataset
def generate_json_metadata(dataset_name, file_name, artist):
    songs = {}
    with open(f"./egs/tmp/data_{file_name}.jsonl") as songs_data:
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
data_entries = [
    DatasetEntry("https://drive.google.com/uc?id=1pFgX8UtrjTmtdCGJkxmhrQJTXt2H8xOD", "Beat Hype", "Imuno"),
    DatasetEntry("https://drive.google.com/uc?id=1mp9vTPHoMY-pcAtbmT7WfbnhkDbssn0g", "Dark Forces", "J1K"),
    DatasetEntry("https://drive.google.com/uc?id=1AaYk89p8GJOkXNUE6VBfe1fLOMMRDABh", "Wolves and Sheep", "Marswell"),
    DatasetEntry("https://drive.google.com/uc?id=1ktT3zej6yOHMBmnPKvMIRHXlvwmk0_TU", "007", "Mobb"),
    DatasetEntry("https://drive.google.com/uc?id=1EWe7aCHk41yEeiYHETvnwRBqh2n4AZOx", "0201", "Mobb"),
    DatasetEntry("https://drive.google.com/uc?id=1nNYvGgxDukU1vlCiSdUzaotYqsSUgoNn", "Instros", "TKMAK"),
    DatasetEntry("https://drive.google.com/uc?id=1Gq-ikxkWz9ap4Khau97WjWstvo82eFIY", "Lost Instrumentals Vol 1", "WORST"),

    DatasetEntry("https://drive.google.com/uc?id=1UtMvAX7a74tBv9rumwFzOsQE4q-Ct4AE", "Various", "Var"),
]

try:
    subprocess.check_call(["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
except:
    print("\n\nMake sure you have ffmpeg installed.")
    print("     sudo apt-get install ffmpeg")
    sys.exit(-1)

shutil.copyfile("config/musicgen_base_32khz_custom.yaml", "audiocraft/config/solver/musicgen/musicgen_base_32khz_custom.yaml")

os.chdir("audiocraft/")
try:
    os.mkdir("data/")
except OSError as e:
    if e.errno != errno.EEXIST: # errno.EEXIST = file or directory exists
        raise

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

try:
    os.remove("egs/custom/data.jsonl")
except OSError as e:
    if e.errno != errno.ENOENT: # errno.ENOENT = no such file or directory
        raise

for entry in data_entries:
    gdown.download(entry.name, f"{entry.get_file_name()}.zip")

    with ZipFile(f"./{entry.get_file_name()}.zip", 'r') as zip_file:
        zip_file.extractall(f"./data/{entry.name}")
    os.remove(f"./{entry.get_file_name()}.zip")

    subprocess.check_call([sys.executable, "-m", "audiocraft.data.audio_dataset", f"data/{entry.name}", f"egs/tmp/data_{entry.get_file_name()}.jsonl"])

    generate_json_metadata(entry.name, entry.get_file_name(), entry.artist)

    # concatenate all existing dataset information in a single data.jsonl file that will be used by dora
    with open("egs/custom/data.jsonl", "a") as data, open(f"egs/tmp/data_{entry.get_file_name()}.jsonl", "w") as ds:
        data.write(ds.read())

    shutil.move(f"data/{entry.name}", "data/")

env = os.environ.copy()
# env["USER"] = "<user name>" # I needed to add this when testing in colab and kaggle
env["HYDRA_FULL_ERROR"] = "1"
# fine tune the model
subprocess.check_call(["dora", "run", "-d", "solver=musicgen/musicgen_base_32khz_custom.yaml", "model/lm/model_scale=small", "continue_from=//pretrained/facebook/musicgen-small", "conditioner=text2music", "dset=audio/custom"], env=env)

# NOTE: You can use this command to restart training from a checkpoint:
#  USER=root HYDRA_FULL_ERROR=1 dora run -d solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=/tmp/audiocraft_root/xps/29c15616/checkpoint.th conditioner=text2music dset=audio/custom
