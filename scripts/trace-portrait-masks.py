"""Derive display-only CSS silhouettes. Source video pixels/files are never modified.
Requires local OpenCV + NumPy; run only when replacing the supplied portrait clips.
"""
from pathlib import Path
import cv2
import numpy as np
import json

root = Path(__file__).resolve().parents[1]
for number in ['01', '02']:
    source = root / 'public/videos' / f'mayank-portrait-{number}.mp4'
    capture = cv2.VideoCapture(str(source))
    fps = capture.get(cv2.CAP_PROP_FPS)
    polygons = []
    areas = []
    while True:
        ok, image = capture.read()
        if not ok: break
        h, w = image.shape[:2]
        # The browser uses object-fit: cover in a square. Trace that same crop.
        image = image[:, (w-h)//2:(w+h)//2]
        b,g,r = cv2.split(image.astype(np.int16))
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        foreground = ((np.maximum.reduce([b,g,r]) < 178) | ((r-b > 54) & (hsv[:,:,1] > 64))).astype(np.uint8)*255
        foreground = cv2.morphologyEx(foreground, cv2.MORPH_CLOSE, np.ones((3,3), np.uint8))
        # Skin, hair and the two jacket panels can be disconnected by a bright shirt.
        # Join their row envelopes, rather than accidentally selecting only one panel.
        _, labels, stats, _ = cv2.connectedComponentsWithStats(foreground)
        keep = np.flatnonzero(stats[:,cv2.CC_STAT_AREA] > 250)
        keep = keep[keep != 0]
        foreground = np.isin(labels, keep)
        solid = np.zeros((h,h), np.uint8)
        for y in range(h):
            xs = np.flatnonzero(foreground[y])
            if len(xs): solid[y,xs[0]:xs[-1]+1] = 255
        solid = cv2.morphologyEx(solid,cv2.MORPH_CLOSE,np.ones((5,3),np.uint8))
        solid = cv2.erode(solid, np.ones((2,2),np.uint8))
        contour = max(cv2.findContours(solid,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[0],key=cv2.contourArea)
        points = cv2.approxPolyDP(contour,2.0,True).reshape(-1,2)
        polygons.append('polygon('+','.join(f'{x/h*100:.2f}% {y/h*100:.2f}%' for x,y in points)+')')
        areas.append(cv2.contourArea(contour)/(h*h))
    capture.release()
    dest=source.with_suffix('.mask.json')
    dest.write_text(json.dumps({'fps':fps,'frames':polygons},separators=(',',':')))
    print(number, len(polygons),'frames;',dest.stat().st_size,'bytes; silhouette area', min(areas),max(areas))
