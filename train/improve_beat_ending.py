# this was written for python3.12.7 and pydub==0.25.1

from pydub import AudioSegment
import math

song = AudioSegment.from_wav("../frontend/public/tmpa3r_4fzj.wav"); reverse=False
# song = AudioSegment.from_wav("../frontend/public/tmpf1u8uoge.wav"); reverse=True
n = 8
last_n_s = song[-n*1000:] # last n seconds

# last_n_s = last_n_s + last_n_s

print(dir(last_n_s[-1]))
min = math.inf
min_i = 0
i = 0
# get the quietest ms excerpt of the last n seconds of the beat
for x in last_n_s:
    if x.dBFS < min:
        min = x.dBFS
        min_i = i
    print(x.dBFS, end=",")
    i += 1
print()
print("min: ", min, min_i)
# last_n_s.export("temp.wav", format="wav")

# repeat the last n seconds either by reversing from the quietest point, or just repeating everything
def repeat(last_n_s, min_i, reverse=True):
    if reverse:
        return last_n_s[min_i:].reverse() + last_n_s[min_i:]
    else:
        return last_n_s
last_n_s = last_n_s + repeat(last_n_s, min_i, reverse=reverse)
last_n_s = last_n_s.fade(to_gain=-120.0, end=math.floor(len(last_n_s)), duration=(n*1000 - min_i) * 2) # the fade out is enough if the beat is longer than 2.5mins
song = song[:-8000] + last_n_s
song.export("temp2.wav", format="wav")
