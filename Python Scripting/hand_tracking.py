import cv2
import mediapipe as mp
import socket
import json

# ----------------------------
# UDP configuration
# ----------------------------
UDP_IP = "127.0.0.1"
UDP_PORT = 5005
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# ----------------------------
# MediaPipe Hands setup
# ----------------------------
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise RuntimeError("Cannot open camera")

print("🖐 Hand tracking started...")

UNITY_SCALE = 2.0  # scale to match Unity units

while True:
    ret, frame = cap.read()
    if not ret:
        continue

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    if results.multi_hand_landmarks:
        hand_landmarks = results.multi_hand_landmarks[0]

        keypoints = []
        for lm in hand_landmarks.landmark:
            # Convert normalized coordinates to centered Unity space
            x = (lm.x - 0.5) * UNITY_SCALE * w / max(w, h)  # center at 0
            y = -(lm.y - 0.5) * UNITY_SCALE * h / max(w, h)  # invert Y
            z = -lm.z * UNITY_SCALE  # invert Z for Unity

            keypoints.append({
                "x": x,
                "y": y,
                "z": z
            })

        msg = json.dumps(keypoints).encode("utf-8")
        sock.sendto(msg, (UDP_IP, UDP_PORT))
        print(f"Sent hand landmarks ✔ First: {keypoints[0]}")

        # Optional: draw landmarks on frame
        mp.solutions.drawing_utils.draw_landmarks(
            frame,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS
        )

    cv2.imshow("MediaPipe Hand", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
