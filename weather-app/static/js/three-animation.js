// Three.js Weather Animation
let scene, camera, renderer;
let particles = [];
let animationType = 'clear';

// Initialize Three.js Scene
function initThreeScene() {
    const canvas = document.getElementById('three-canvas');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Start with clear weather
    createClearWeather();
    
    // Start animation loop
    animate();
}

// Window Resize Handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update particles based on weather type
    particles.forEach(particle => {
        if (animationType === 'rain' || animationType === 'drizzle') {
            particle.position.y -= particle.userData.speed;
            if (particle.position.y < -10) {
                particle.position.y = 10;
            }
        } else if (animationType === 'snow') {
            particle.position.y -= particle.userData.speed * 0.3;
            particle.position.x += Math.sin(particle.userData.offset + Date.now() * 0.001) * 0.01;
            if (particle.position.y < -10) {
                particle.position.y = 10;
            }
        } else if (animationType === 'clouds') {
            particle.position.x += particle.userData.speed * 0.5;
            if (particle.position.x > 15) {
                particle.position.x = -15;
            }
            particle.rotation.z += 0.001;
        } else if (animationType === 'clear') {
            particle.rotation.y += particle.userData.speed * 0.5;
            particle.rotation.x += particle.userData.speed * 0.3;
        }
    });
    
    renderer.render(scene, camera);
}

// Clear existing particles
function clearParticles() {
    particles.forEach(particle => {
        scene.remove(particle);
        if (particle.geometry) particle.geometry.dispose();
        if (particle.material) particle.material.dispose();
    });
    particles = [];
}

// Create Rain Animation
function createRain() {
    clearParticles();
    animationType = 'rain';
    
    const geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.6
    });
    
    for (let i = 0; i < 500; i++) {
        const raindrop = new THREE.Mesh(geometry, material);
        raindrop.position.set(
            Math.random() * 30 - 15,
            Math.random() * 20,
            Math.random() * 10 - 5
        );
        raindrop.userData.speed = Math.random() * 0.2 + 0.3;
        scene.add(raindrop);
        particles.push(raindrop);
    }
}

// Create Snow Animation
function createSnow() {
    clearParticles();
    animationType = 'snow';
    
    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    
    for (let i = 0; i < 300; i++) {
        const snowflake = new THREE.Mesh(geometry, material);
        snowflake.position.set(
            Math.random() * 30 - 15,
            Math.random() * 20,
            Math.random() * 10 - 5
        );
        snowflake.userData.speed = Math.random() * 0.05 + 0.02;
        snowflake.userData.offset = Math.random() * Math.PI * 2;
        scene.add(snowflake);
        particles.push(snowflake);
    }
}

// Create Clouds Animation
function createClouds() {
    clearParticles();
    animationType = 'clouds';
    
    for (let i = 0; i < 15; i++) {
        const cloudGroup = new THREE.Group();
        
        // Create cloud from multiple spheres
        const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });
        
        for (let j = 0; j < 5; j++) {
            const sphere = new THREE.Mesh(sphereGeometry, material);
            sphere.position.set(
                Math.random() * 1.5 - 0.75,
                Math.random() * 0.5 - 0.25,
                Math.random() * 0.5 - 0.25
            );
            sphere.scale.set(
                Math.random() * 0.5 + 0.8,
                Math.random() * 0.5 + 0.8,
                Math.random() * 0.5 + 0.8
            );
            cloudGroup.add(sphere);
        }
        
        cloudGroup.position.set(
            Math.random() * 30 - 15,
            Math.random() * 8 - 2,
            Math.random() * 10 - 5
        );
        cloudGroup.userData.speed = Math.random() * 0.01 + 0.005;
        
        scene.add(cloudGroup);
        particles.push(cloudGroup);
    }
}

// Create Clear Weather Animation (Floating particles)
function createClearWeather() {
    clearParticles();
    animationType = 'clear';
    
    const geometry = new THREE.OctahedronGeometry(0.1, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    
    for (let i = 0; i < 50; i++) {
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(
            Math.random() * 30 - 15,
            Math.random() * 20 - 10,
            Math.random() * 10 - 5
        );
        particle.userData.speed = Math.random() * 0.01 + 0.005;
        scene.add(particle);
        particles.push(particle);
    }
}

// Create Thunderstorm Animation
function createThunderstorm() {
    createRain();
    animationType = 'rain';
    
    // Add occasional lightning effect
    setInterval(() => {
        if (Math.random() > 0.7) {
            const originalColor = scene.background;
            scene.background = new THREE.Color(0xffffff);
            setTimeout(() => {
                scene.background = originalColor;
            }, 100);
        }
    }, 3000);
}

// Create Mist/Fog Animation
function createMist() {
    clearParticles();
    animationType = 'clouds';
    
    for (let i = 0; i < 20; i++) {
        const geometry = new THREE.SphereGeometry(2, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.15
        });
        
        const mist = new THREE.Mesh(geometry, material);
        mist.position.set(
            Math.random() * 30 - 15,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        );
        mist.userData.speed = Math.random() * 0.005 + 0.002;
        
        scene.add(mist);
        particles.push(mist);
    }
}

// Update animation based on weather condition
function updateWeatherAnimation(weatherCondition) {
    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
        createRain();
    } else if (condition.includes('snow')) {
        createSnow();
    } else if (condition.includes('cloud')) {
        createClouds();
    } else if (condition.includes('thunder') || condition.includes('storm')) {
        createThunderstorm();
    } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
        createMist();
    } else {
        createClearWeather();
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
} else {
    initThreeScene();
}
