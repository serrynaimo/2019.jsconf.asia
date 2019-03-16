// Dreamy Garden
// https://github.com/serrynaimo/2019.jsconf.asia/pull/8

// Based on code by https://medium.com/david-guan/webgl-and-image-filter-101-5017b290d02f
const gl = document.querySelector('canvas').getContext('webgl')

gl.clearColor(0.0941, 0.0941, 0.0941, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

const vertexShaderSource = `
  precision mediump float;
  attribute vec2 position;
  varying vec2 v_coord;
  uniform float time;

  void main() {
    // gl_position is a special variable a vertex shader is responsible for setting
    gl_Position = vec4(position, 0, 1);
    v_coord = gl_Position.xy / (1.0 + (5.0 / (1.0 + time / 5.0))) * 0.5 + 0.5;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_coord;
  uniform sampler2D u_texture;
  uniform float time;

  void main() {
    vec4 sampleColor = texture2D(u_texture, vec2(v_coord.x, 1.0 - v_coord.y));
    float t = time / 20.0 - 1.0 - length(v_coord - vec2(0.48, 0.6)) * 1.41;
    float color = mod(sampleColor[1] + t, 1.0);
    if (sampleColor[1] + t < 0.0) {
      gl_FragColor = vec4(0.0941, 0.0941, 0.0941, 1);
      return;
    } else if (color < 0.125) {
      gl_FragColor = vec4(0.101, 0.544, 0.819, 1);
    } else if (color < 0.25) {
      gl_FragColor = vec4(0.197, 0.101, 0.819, 1);
    } else if (color < 0.375) {
      gl_FragColor = vec4(0.735, 0.101, 0.819, 1);
    } else if (color < 0.5) {
      gl_FragColor = vec4(0.819, 0.101, 0.364, 1);
    } else if (color < 0.625) {
      gl_FragColor = vec4(0.819, 0.376, 0.101, 1);
    } else if (color < 0.75) {
      gl_FragColor = vec4(0.723, 0.819, 0.101, 1);
    } else if (color < 0.875) {
      gl_FragColor = vec4(0.185, 0.819, 0.101, 1);
    } else {
      gl_FragColor = vec4(0.101, 0.819, 0.556, 1);
    }
    gl_FragColor = gl_FragColor * 0.75 + 0.0941;
  }
`


function createShader(gl, type, shaderSource) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    console.warn(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }

  return shader
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
)

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) {
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
  }

  return program
}

const program = createProgram(gl, vertexShader, fragmentShader)
const positionAttributeLocation = gl.getAttribLocation(program, 'position')
const colorUniformLocation = gl.getUniformLocation(program, 'color')
const timeLocation = gl.getUniformLocation(program, 'time')

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

gl.useProgram(program)
gl.enableVertexAttribArray(positionAttributeLocation)

// gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
// This method bind ARRAY_BUFFER to specified attribute
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

// gl.STATIC_DRAW tells WebGL that the data are not likely to change.
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1]),
  gl.STATIC_DRAW
)

const texture = gl.createTexture()
texture.image = new Image()
texture.image.onload = function() {
  handleLoadedTexture(gl, texture)
}
texture.image.crossOrigin = ''
texture.image.src = 'garden.jpg'

function handleLoadedTexture(gl, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    texture.image
  )
  let startTime = Date.now()

  function frame() {
    gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    requestAnimationFrame(frame)
  }
  frame()
}
