#!/bin/bash

/home/michael/p/personal/rotary/vendor/piper/piper \
    --length_scale=5 --sentence_silence=0.5 \
    --model /home/michael/p/personal/rotary/vendor/piper/voices/en_US-amy-medium.onnx \
    --output-raw -f - | \
  sox -v 0.7 -t raw -e signed -r 22050 -b 16 - -r 8000 -b 16 -c 1 -t wav -

