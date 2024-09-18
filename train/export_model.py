#!/usr/bin/env python3

# export the model
# first, in order to get the model signature, run:
#  dora info solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=//pretrained/facebook/musicgen-small conditioner=text2music dset=audio/custom
#  (based on the command you used for fine-tuning)

from audiocraft.utils import export
from audiocraft import train

SIG = "ADD MODEL SIGNATURE HERE"

xp = train.main.get_xp_from_sig(SIG)
export.export_lm(xp.folder / 'checkpoint.th', '/checkpoints/my_audio_lm/state_dict.bin')

export.export_pretrained_compression_model('facebook/encodec_32khz', '/checkpoints/my_audio_lm/compression_state_dict.bin')

print("Export succeeded. You can now use /checkpoints/my_audio_lm as a model for audio generation.")
