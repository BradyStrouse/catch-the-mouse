var mouse = { x: 0, y: 0 };

// Automatically updates the mouse position on move
document.addEventListener("mousemove", function (e) {
  const { clientX: computer_x, clientY: computer_y } = e;
  mouse = { x: computer_x, y: computer_y };
});

function updatePositions() {
  let mouseElement = document.querySelector(".mouse");

  // Extract the current transform values
  const transform = window.getComputedStyle(mouseElement).transform;
  const matrix = new DOMMatrix(transform);

  let pos2 = {
    x: matrix.m41, // x position from matrix
    y: matrix.m42, // y position from matrix
  };

  let pos1 = { x: mouse.x, y: mouse.y };

  const repulsionStrength = 20000; // Adjust this value to change the strength of the repulsion

  let mouseWidth = mouseElement.offsetWidth;
  let mouseHeight = mouseElement.offsetHeight;
  let centerPos2 = {
    x: pos2.x + mouseWidth / 2,
    y: pos2.y + mouseHeight / 2,
  };
  // Calculate distance between the two elements
  const dx = centerPos2.x - pos1.x;
  const dy = centerPos2.y - pos1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    // Calculate repulsion force
    const force = repulsionStrength / (distance * distance);

    // Calculate direction of the force
    const fx = (dx / distance) * force;
    const fy = (dy / distance) * force;
    if (Math.abs(fx) <= 0.05 && Math.abs(fy) <= 0.05) {
      return;
    }
    const directionAngleRadians = Math.atan2(fy, fx) - Math.PI / 2;
    let mouseImg = document.getElementById("mouseImg");
    mouseImg.style.transform = `rotate(${directionAngleRadians}rad)`;
    // Update positions based on the force
    pos2.x += fx;
    pos2.y += fy;
  }

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Bounce off the edges
  if (pos2.x < 0) {
    pos2.x = 0;
  } else if (pos2.x + mouseWidth > viewportWidth) {
    pos2.x = viewportWidth - mouseWidth;
  }

  if (pos2.y < 0) {
    pos2.y = 0;
  } else if (pos2.y + mouseHeight > viewportHeight) {
    pos2.y = viewportHeight - mouseHeight;
  }
  // Update the positions of the elements
  mouseElement.style.transform = `translate(${pos2.x}px, ${pos2.y}px)`;
}

function animate() {
  updatePositions();
  requestAnimationFrame(animate);
}

// Move the mouse image to the center of the screen
function normalizemouseElement() {
  let mouseElement = document.querySelector(".mouse");
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let repellerWidth = mouseElement.offsetWidth;
  let repellerHeight = mouseElement.offsetHeight;
  let leftPosition = (viewportWidth - repellerWidth) / 2;
  let topPosition = (viewportHeight - repellerHeight) / 2;

  // Set initial position
  mouseElement.style.transform = `translate(${leftPosition}px, ${topPosition}px)`;
}

normalizemouseElement();
animate();