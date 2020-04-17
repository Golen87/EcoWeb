import sys, os
from os import listdir
from os.path import isfile, join
from PIL import Image

if len(sys.argv) < 3:
	print('python3 kod.py <input-dir> <size>')
	sys.exit()

input_dir = sys.argv[1]
size = int(sys.argv[2])
output_dir = str(size)

if not os.path.exists(output_dir):
	os.mkdir(output_dir)

for file in [f for f in listdir(input_dir) if isfile(join(input_dir, f))]:
	input_path = join(input_dir, file)
	output_path = join(output_dir, file)


	im1 = Image.open(input_path).convert("RGBA")
	icc_profile = im1.info.get('icc_profile')

	if im1.size[0] != im1.size[1]:
		print(f"Warning: '{file}'' is not square: {im1.size}")

	im2 = im1.resize((size,size), Image.ANTIALIAS)
	im2.save(output_path, icc_profile=icc_profile)