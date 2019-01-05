console.clear();

const params = {
  width: 20,
  height: 40,
  xVariance: 0.15,
  yVariance: 0.2,
  yStep0: 1,
  yStep1: 1.2,

  extrudeOptions: {
    amount: 2,
    bevelEnabled: false,
    bevelThickness: 0.005,
    bevelSize: 0.01,
    bevelSegments: 1
  }
};

function init(scene) {
  // helpers
  // scene.add(new THREE.GridHelper(50, 100, 0x666666, 0x444444));

  // set up the main-group that rotates the xy-plane into the xz-plane and
  // centers the stage
  const mainGroup = new THREE.Group();
  mainGroup.position.set(-params.width / 2, 0, params.height / 2);
  mainGroup.rotation.x = -Math.PI / 2;
  scene.add(mainGroup);

  // build a list of randomized alternating lines
  const vertexLines = [];
  for (let ri = 0; ri < params.height; ri++) {
    vertexLines.push(buildVertexLine(ri % 2 !== 0));
  }

  // join the lines to pairs, each pair will create a row of hexagons
  // (could be removed for optimization)
  const linePairs = [];
  for (let ri = 0; ri < params.height; ri++) {
    linePairs.push([
      vertexLines[ri],
      vertexLines[(ri + 1) % vertexLines.length]
    ]);
  }

  // iterate over the pairs of lines and create the filling hexagons between
  // each pair
  const rowGroups = [];
  for (let i = 0; i < linePairs.length; i++) {
    const [line0, line1] = linePairs[i];
    const rowGroup = new THREE.Group();

    rowGroup.position.y = getRowYPosition(i);

    rowGroup.add(...getRowPrismMeshes(i, line0, line1));
    rowGroup.add(getLineObject(linePairs[i][0]));

    rowGroups.push(rowGroup);
  }

  mainGroup.add(...rowGroups);

  const wrapYPosition = getRowYPosition(params.height);
  return t => {
    rowGroups.forEach((group, i) => {
      group.position.y = (group.position.y - 0.2 + wrapYPosition) % wrapYPosition;
      group.rotation.y = (-group.position.y/2 + Math.sin(t/2000) * -3) / 180 * Math.PI;
    });
  };
}

const line1Offset = new THREE.Vector3();
function getRowPrismMeshes(row, line0, line1) {
  const meshes = [];
  const indexOffset = row % 2;

  line1Offset.y = indexOffset ? params.yStep1 : params.yStep0;
  for (let i0 = indexOffset; i0 < line0.length - 2; i0 += 2) {
    const points = [
      line1[i0].clone().add(line1Offset),
      line1[i0 + 1].clone().add(line1Offset),
      line1[i0 + 2].clone().add(line1Offset),
      line0[i0 + 2],
      line0[i0 + 1],
      line0[i0]
    ];
    points.push(points[0]);
    meshes.push(getPrismMesh(points));
  }

  return meshes;
}

const tmpMatrix = new THREE.Matrix4();
function getPrismMesh(points) {
  const geom = getExtrudeGeometry(points);
  const mat = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(geom, mat);
  
  mat.color.setHSL(rnd(1, 0.6, 3), rnd(1, 0.5), rnd(0.6, 0.4));

  geom.computeBoundingBox();
  const center = geom.boundingBox.getCenter();
  center.z = 0;
  mesh.position.copy(center);
  tmpMatrix.makeTranslation(...center.multiplyScalar(-1).toArray());
  geom.applyMatrix(tmpMatrix);

  return mesh;
}

function getExtrudeGeometry(points) {
  const extrudeOpts = Object.assign({}, params.extrudeOptions);

  // extrude-amount is random, modulated by distance from center
  // along the x-axis
  extrudeOpts.amount = rnd(0.2) + rnd(
          0.5 * Math.abs(points[0].x - params.width / 2),
          0, 10
      );

  return new THREE.ExtrudeGeometry(
      new THREE.Shape(points), extrudeOpts);
}

function buildVertexLine(invertY) {
  const displacement = new THREE.Vector3();
  const points = [];
  const {xVariance, yVariance} = params;
  for (let baseX = 0; baseX < params.width; baseX++) {
    displacement.set(
        rnd(xVariance, -xVariance),
        rnd(yVariance, -yVariance),
        0
    );

    points.push(new THREE.Vector3(baseX, 0, 0)
        .add(displacement));
  }

  const points2 = [];
  for (let i = 0; i < points.length; i++) {
    const midpoint = new THREE.Vector3(
        i + 0.5 + rnd(xVariance, -xVariance), 0, 0);

    if (invertY) {
      const minY = Math.max(
          points[i].y,
          points[i + 1] ? points[i + 1].y : points[i].y);

      midpoint.y = minY + rnd(2 * yVariance);
    } else {
      const maxY = Math.min(
          points[i].y,
          points[i + 1] ? points[i + 1].y : points[i].y);

      midpoint.y = maxY - rnd(2 * yVariance);
    }

    points2.push(points[i]);
    points2.push(midpoint);
  }

  return points2;
}


function getLineObject(points) {
  const object = new THREE.Line(
      new THREE.Geometry(),
      new THREE.LineBasicMaterial({
            linewidth: 1,
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
          }
      ));

  object.position.z = 0.5;
  object.geometry.vertices = points;

  return object;
}

function getRowYPosition(row) {
  return Math.ceil(row / 2) * params.yStep0 +
      Math.floor(row / 2) * params.yStep1;
}

function rnd(max = 1, min = 0, pow = 1) {
  const rnd = (pow === 1) ?
      Math.random() :
      Math.pow(Math.random(), pow);

  return (max - min) * rnd + min;
}


// ---- boilerplate-code

// .... setup renderer
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
// .... setup scene
const scene = window.scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, .03);

// setup skybox
// const baseUrl = '//usefulthink.com/assets/skybox/';
// const files = [
//   'pos_x.png', 'neg_x.png',
//   'pos_y.png', 'neg_y.png',
//   'pos_z.png', 'neg_z.png'
// ];
// const urls = files.map(file => baseUrl + file);
// const textureCube = new THREE.CubeTextureLoader().load(urls);
// textureCube.format = THREE.RGBFormat;
// textureCube.mapping = THREE.CubeReflectionMapping;
// scene.background = textureCube;


// .... setup camera and controls
const camera = new THREE.PerspectiveCamera(
    110, window.innerWidth / window.innerHeight, 0.01, 1000);
const controls = new THREE.OrbitControls(camera);

camera.position.set(0, 3.3, 20);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// .... setup some lighting
const dirLight = new THREE.DirectionalLight(0xffffff, .5);
dirLight.position.set(-.02, .1, -.2);
scene.add(dirLight, new THREE.AmbientLight(0x888888));

// .... setup and run demo-code
const update = init(scene, camera);
requestAnimationFrame(function loop(time) {
  controls.update();

  if (update) { update(time); }
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
});

// .... bind events
window.addEventListener('resize', ev => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

document.body.appendChild(renderer.domElement);

