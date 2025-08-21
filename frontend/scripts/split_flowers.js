const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

(async () => {
  try {
    const projectRoot = process.cwd();
    const inputPath = path.join(projectRoot, 'public', 'carrucel', 'ArreglosFlorales.png');
    const outDir = path.join(projectRoot, 'public', 'carrucel');

    if (!fs.existsSync(inputPath)) {
      console.error('No se encontró el archivo de entrada:', inputPath);
      process.exit(1);
    }

    const image = sharp(inputPath);
    const meta = await image.metadata();
    const { width, height } = meta;

    if (!width || !height) {
      console.error('No se pudo obtener el tamaño de la imagen.');
      process.exit(1);
    }

    const midX = Math.floor(width / 2);

    const leftOut = path.join(outDir, 'ArregloFloral_left.png');
    const rightOut = path.join(outDir, 'ArregloFloral_right.png');

    // Extraer mitad izquierda
    await sharp(inputPath)
      .extract({ left: 0, top: 0, width: midX, height })
      .resize({ width: 260, withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(leftOut);

    // Extraer mitad derecha
    await sharp(inputPath)
      .extract({ left: midX, top: 0, width: width - midX, height })
      .resize({ width: 260, withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(rightOut);

    console.log('Listo. Generados:', leftOut, rightOut);
  } catch (err) {
    console.error('Error al procesar la imagen:', err);
    process.exit(1);
  }
})();
