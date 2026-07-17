Actúa como un Desarrollador Frontend Senior experto en React, animaciones web y gráficos en el navegador. Quiero construir dos versiones diferentes para mi portafolio de programación para comparar enfoques. No quiero usar Blender ni modelado externo; para la versión 3D quiero generar todo mediante geometrías nativas por código.

Por favor, dame la estructura de archivos, la configuración inicial y el código de los componentes clave para ambas opciones utilizando React (puedes asumir Vite como bundler) y Tailwind CSS para los estilos.

---

### REQUISITOS GENERALES PARA AMBOS PORTAFOLIOS
Cada versión debe incluir las siguientes secciones en una sola página (Single Page Application):
1. Hero/Inicio: Título impactante, mi rol y botón de contacto.
2. Proyectos: Una cuadrícula o sección interactiva con 3 proyectos (con título, descripción, tags de tecnología y enlaces a GitHub/Live).
3. Contacto: Un pie de página limpio con enlaces a redes.

---

### ENFOQUE 1: PORTAFOLIO CON EFECTO PARALLAX (2.5D)
Quiero lograr un efecto de profundidad fluido al hacer scroll sin usar Three.js.
- Tecnologías: React, Tailwind CSS y Framer Motion (o GSAP, elije la que consideres más limpia y declarativa para React).
- Objetivo: Que las diferentes capas de fondo (formas geométricas abstractas, textos o tarjetas) se muevan a velocidades distintas al bajar con el scroll, creando una ilusión de profundidad tridimensional.
- Por favor, facilítame el componente del "Hero" y de "Proyectos" aplicando esta lógica de scroll de forma optimizada (evitando caídas de FPS).

---

### ENFOQUE 2: PORTAFOLIO CON 3D REAL (React Three Fiber)
Quiero una escena interactiva real en el Hero, pero construida puramente con código.
- Tecnologías: React, Tailwind CSS, @react-three/fiber y @react-three/drei.
- Diseño: Quiero que en el Hero haya un canvas 3D interactivo. Utiliza geometrías nativas (como un cubo mesh `<boxGeometry />`, una esfera `<sphereGeometry />` o un toroide `<torusGeometry />`) con materiales atractivos (puedes usar MeshMeshToonMaterial o MeshPhysicalMaterial con luces direccionales y ambientales).
- Interactividad: El objeto o los objetos 3D deben rotar sutilmente de forma automática, pero también deben reaccionar al pasar el ratón por encima (hover) cambiando de color o escalando su tamaño, y deben rotar ligeramente siguiendo la posición del cursor del usuario.

---

Por favor, empieza guiándome con la instalación de dependencias para cada enfoque y luego muéstrame el código estructurado, limpio y con comentarios explicativos de los componentes principales de ambas versiones.