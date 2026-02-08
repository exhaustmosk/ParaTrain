using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class PoseImageController : MonoBehaviour
{
    public Image poseImage;
    public List<Sprite> poseSprites;
    public float poseDuration = 10f;

    private int currentIndex = 0;
    private float timer = 0f;

    public int CurrentPoseIndex => currentIndex;

    void Start()
    {
        poseImage.sprite = poseSprites[0];
    }

    void Update()
    {
        timer += Time.deltaTime;

        if (timer >= poseDuration)
        {
            timer = 0f;
            currentIndex = (currentIndex + 1) % poseSprites.Count;
            poseImage.sprite = poseSprites[currentIndex];
        }
    }
}
