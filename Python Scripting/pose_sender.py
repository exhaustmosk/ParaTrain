import cv2
import mediapipe as mp
import socket
import json

# ----------------------------
# UDP configuration
# ----------------------------
UDP_IP = "127.0.0.1"  # Unity is running on the same machine
UDP_PORT = 5005       # Fixed port to listen in Unity

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# ----------------------------
# MediaPipe Pose setup
# ----------------------------
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise RuntimeError("Cannot open camera. Check camera permissions!")

print("Starting camera loop...")

while True:
    ret, frame = cap.read()
    if not ret:
        continue

    # Flip frame for mirror effect
    frame = cv2.flip(frame, 1)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        # Extract keypoints
        keypoints = [{"x": lm.x, "y": lm.y, "z": lm.z} 
                     for lm in results.pose_landmarks.landmark]

        # Send via UDP
        msg = json.dumps(keypoints).encode("utf-8")
        sock.sendto(msg, (UDP_IP, UDP_PORT))

        # Debug: print first keypoint
        print(f"Sent {len(keypoints)} keypoints. First: {keypoints[0]}")

    cv2.imshow("MediaPipe Pose", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
