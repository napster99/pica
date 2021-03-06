precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_image;
uniform vec2 u_imageSize;

#define winSize 3.0

varying vec2 v_texCoord;

#define sinc(a) (sin(a)/a)
#define M_PI 3.1415926535897932384626433832795

void main() {
  vec2 pixel = vec2(1.) / u_imageSize;
  gl_FragColor = vec4(0.);

  float total = 0.;
  float scale = u_imageSize.x / u_resolution.x;
  float count = winSize * scale * 2.;
  for (int i = 0; i < 1024*8; i++) {
    if (float(i) >= count) {
      break;
    }
    float k = float(i) - (count / 2.);
    vec2 offset = vec2(pixel.x * k, 0.);
    vec4 c = texture2D(u_image, v_texCoord+offset);
    float x = k / scale; // max [-3, 3]
    float xpi = x * M_PI;
    float b = sinc(xpi) * sinc(xpi / winSize);
    if (x > -1.19209290E-07 && x < 1.19209290E-07) { 
      b = 1.;
    }
    total += b;
    c *= vec4(b);
    gl_FragColor += c;
  }
  gl_FragColor /= vec4(total);
}
