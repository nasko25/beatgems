#!/usr/bin/env python3

# export the model
# first, in order to get the model signature, run:
#  dora info solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=//pretrained/facebook/musicgen-small conditioner=text2music dset=audio/custom
#  (based on the command you used for fine-tuning)

from audiocraft.utils import export
from audiocraft import train
import argparse

SIG = "" # ADD MODEL SIGNATURE HERE

parser = argparse.ArgumentParser(
    prog='export_model',
    description='audiocraft model exporting script',
    epilog='Export any fine-tuned audiocraft model after training with fine_tune.py')

parser.add_argument('-s', '--signature')
args = parser.parse_args()

if SIG != "" and args.signature is not None:
    raise Exception("You have set a signature both in the script and as a command argument. Make sure this is not a mistake.")
elif SIG == "":
    SIG = args.signature

if SIG is None:
    raise Exception("Model signature was not set. Check the README on how to set it")

print(f"\nUsing model signature {SIG}")
xp = train.main.get_xp_from_sig(SIG)
export.export_lm(xp.folder / 'checkpoint.th', 'checkpoints/my_audio_lm/state_dict.bin')

export.export_pretrained_compression_model('facebook/encodec_32khz', 'checkpoints/my_audio_lm/compression_state_dict.bin')

print("Export succeeded. You can now use checkpoints/my_audio_lm as a model for audio generation.")
