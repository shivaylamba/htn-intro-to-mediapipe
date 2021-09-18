 const videoElement = document.getElementsByClassName('input_video')[0];
  const canvasElement = document.getElementsByClassName('output_canvas')[0];
  const canvasCtx = canvasElement.getContext('2d');
  const img = document.getElementById("vbackground");

  function onResults(results) {
    // Save the context's blank state
    canvasCtx.save();

    // Draw the raw frame
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);

    // // Make all pixels not in the segmentation mask transparent
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);


    // // Blur the context for all subsequent draws then set the raw image as the background
    // // canvasCtx.filter = 'blur(16px)';
    canvasCtx.globalCompositeOperation = 'destination-over';
    canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);

    // Restore the context's blank state
    canvasCtx.restore();
  }

  const selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
  }});
  selfieSegmentation.setOptions({
    modelSelection: 1,
  });
  selfieSegmentation.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await selfieSegmentation.send({image: videoElement});
    },
    width: 640,
    height: 480
  });
  camera.start();