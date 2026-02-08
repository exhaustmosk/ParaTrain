using UnityEngine;
using UnityEngine.UI;

public class PoseDisplayUI : MonoBehaviour
{
    public Image poseImage;
    public Sprite peaceSprite;
    public Sprite rockSprite;

    public void ShowPose(string poseName)
    {
        switch (poseName)
        {
            case "Peace":
                poseImage.sprite = peaceSprite;
                break;
            case "Rock":
                poseImage.sprite = rockSprite;
                break;
        }
    }
}
