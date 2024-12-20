#!/usr/bin/env python3

import gdown
from zipfile import ZipFile
import shutil
import subprocess
import sys
import json
import os, errno
import argparse

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

def mkdir(dir):
    try:
        os.mkdir(dir)
    except OSError as e:
        if e.errno != errno.EEXIST: # errno.EEXIST = file or directory exists
            raise

parser = argparse.ArgumentParser(
    prog='fine_tune',
    description='audiocraft fine-tuning script',
    epilog='Fine-tune any pretrained audiocraft model using your custom dataset')

parser.add_argument('-m', '--model', type=int, choices=range(1, 4))
parser.add_argument('--skip-download', action='store_true')
args = parser.parse_args()
model = {
    1: "small",
    2: "medium",
    3: "large"
}[args.model or 1]

skip_download = args.skip_download

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
mkdir("data/")

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

with open("config/teams/default.yaml", "w") as f:
    f.write("""default:
  dora_dir: tmp/audiocraft_${oc.env:USER}
  partitions:
    global: debug
    team: debug
  reference_dir: tmp # TODO: or /tmp ??
darwin:  # if we detect we are on a Mac, then most likely we are doing unit testing etc.
  dora_dir: /tmp/audiocraft_${oc.env:USER}
  partitions:
    global: debug
    team: debug
  reference_dir: /tmp # TODO: or tmp ??
""")

# subprocess.check_call([sys.executable, "-m", "pip", "install", "torch==2.1.0"])
# subprocess.check_call([sys.executable, "-m", "pip", "install", "setuptools", "wheel"])
subprocess.check_call([sys.executable, "-m", "pip", "install", "-e", "."])

try:
    os.remove("egs/custom/data.jsonl")
except OSError as e:
    if e.errno != errno.ENOENT: # errno.ENOENT = no such file or directory
        raise

mkdir("egs/custom/")
for entry in data_entries:
    dir_name = f"./data/{entry.name}"
    # skip download and extract if folder exists
    # if os.path.isdir(f"./data/{entry.name}"):
    #     continue

    if not skip_download:
        gdown.download(entry.url, f"{entry.get_file_name()}.zip")

        with ZipFile(f"./{entry.get_file_name()}.zip", 'r') as zip_file:
            zip_file.extractall(dir_name)
        os.remove(f"./{entry.get_file_name()}.zip")

        # delete all files that are not mp3 audio files
        for file in os.listdir(dir_name):
            if not file.endswith(".mp3"):
                os.remove(os.path.join(dir_name, file))

    subprocess.check_call([sys.executable, "-m", "audiocraft.data.audio_dataset", f"data/{entry.name}", f"egs/tmp/data_{entry.get_file_name()}.jsonl"])

    generate_json_metadata(entry.name, entry.get_file_name(), entry.artist)

    # concatenate all existing dataset information in a single data.jsonl file that will be used by dora
    with open("egs/custom/data.jsonl", "a") as data, open(f"egs/tmp/data_{entry.get_file_name()}.jsonl", "r") as ds:
            data.write(ds.read())


env = os.environ.copy()
# env["USER"] = "<user name>" # I needed to add this when testing in colab and kaggle
env["HYDRA_FULL_ERROR"] = "1"

# ------------------------------------------------------------------------------------
# might help with this error:
"""
[E ProcessGroupNCCL.cpp:474] [Rank 0] Watchdog caught collective operation timeout: WorkNCCL(SeqNum=1, OpType=ALLREDUCE, NumelIn=2, NumelOut=2, Timeout(ms)=1800000) ran for 1800646 mil
liseconds before timing out.
[E ProcessGroupNCCL.cpp:488] Some NCCL operations have failed or timed out. Due to the asynchronous nature of CUDA kernels, subsequent GPU operations might run on corrupted/incomplete
data.
[E ProcessGroupNCCL.cpp:494] To avoid data inconsistency, we are taking the entire process down.
[E ProcessGroupNCCL.cpp:915] [Rank 0] NCCL watchdog thread terminated with exception: [Rank 0] Watchdog caught collective operation timeout: WorkNCCL(SeqNum=1, OpType=ALLREDUCE, NumelI
n=2, NumelOut=2, Timeout(ms)=1800000) ran for 1800646 milliseconds before timing out.
terminate called after throwing an instance of 'std::runtime_error'
  what():  [Rank 0] NCCL watchdog thread terminated with exception: [Rank 0] Watchdog caught collective operation timeout: WorkNCCL(SeqNum=1, OpType=ALLREDUCE, NumelIn=2, NumelOut=2, T
imeout(ms)=1800000) ran for 1800646 milliseconds before timing out.
Executor: Worker 0 died, killing all workers
"""
# env["NCCL_BLOCKING_WAIT"] = "0"
# ------------------------------------------------------------------------------------


# fine tune the model
subprocess.check_call(["dora", "run", "-d", "solver=musicgen/musicgen_base_32khz_custom.yaml", f"model/lm/model_scale={model}", f"continue_from=//pretrained/facebook/musicgen-{model}", "conditioner=text2music", "dset=audio/custom"], env=env)

print("Fine-tuning done. You can now run")
print(f"\tdora info solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale={model} continue_from=//pretrained/facebook/musicgen-{model} conditioner=text2music dset=audio/custom")
print("to get information about the model (like the signature)")

# NOTE: You can use this command to restart training from a checkpoint:
#  USER=root HYDRA_FULL_ERROR=1 dora run -d solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=/tmp/audiocraft_root/xps/29c15616/checkpoint.th conditioner=text2music dset=audio/custom
