import React, { useRef, useEffect } from "react";

interface Props {
  length: number;
  width: number;
  height: number;
  color: string;
  lineWidth: number;
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  backStrokeDuration: number;
  forwardStrokeDuration: number;
}

export const GolfPuttingStrokeArc: React.FC<Props> = ({
  length,
  width,
  height,
  color,
  lineWidth,
  x,
  y,
  radius,
  startAngle,
  endAngle,
  backStrokeDuration,
  forwardStrokeDuration,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let animationFrameId: number;
  let startTime = performance.now();

  const animate = (timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Set the canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Set the stroke style and line width
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the stroke style and line width
    ctx.strokeStyle = color;
    const elapsedTime = timestamp - startTime;

    // Calculate the line length based on the elapsed time
    let lineLength: number;
    const startLength = 10;
    const length = 500;
    if (elapsedTime < backStrokeDuration) {
      // Increase the line length from startLength to length over backstrokeDuration milliseconds
      lineLength = startLength + (length * elapsedTime) / backStrokeDuration;
    } else if (elapsedTime < backStrokeDuration + forwardStrokeDuration) {
      // Decrease the line length from 300px to 100px over 300 milliseconds
      lineLength =
        length -
        (length * (elapsedTime - backStrokeDuration)) / forwardStrokeDuration;
    } else {
      // Set the line length to 100px if the elapsed time is greater than 900 milliseconds
      lineLength = startLength;
    }

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50 + lineLength, 50);
    ctx.stroke();

    // Request the next animation frame if the elapsed time is less than 1200 milliseconds
    if (elapsedTime < backStrokeDuration + forwardStrokeDuration + 100) {
      animationFrameId = requestAnimationFrame(animate);
    }

    // Animate the arc over the specified duration

    /*    let currentAngle = startAngle;

    const animateArc = (time: number) => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elapsedTime < backStrokeDuration) {
        currentAngle =
          startAngle +
          (elapsedTime / (backStrokeDuration + forwardStrokeDuration)) *
            (endAngle - startAngle);
      }

      // Draw the arc
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, currentAngle);
      ctx.stroke();

    };

    // Start the animation
    animationFrameId = requestAnimationFrame(animateArc);
    */
  };

  useEffect(() => {
    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    length,
    width,
    height,
    color,
    lineWidth,
    x,
    y,
    radius,
    startAngle,
    endAngle,
    backStrokeDuration,
    forwardStrokeDuration,
  ]);

  return <canvas ref={canvasRef} />;
};

GolfPuttingStrokeArc.defaultProps = {
  width: 200,
  height: 200,
  color: "#000000",
  lineWidth: 2,
  x: 100,
  y: 100,
  radius: 50,
  startAngle: 0,
  endAngle: Math.PI,
  backStrokeDuration: 0.6,
  forwardStrokeDuration: 0.3,
};

export default GolfPuttingStrokeArc;
