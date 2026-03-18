"""
Aplicación Flask - Regalo Especial Día del Hombre
Para José (Oso Polar) con amor
"""

from flask import Flask, render_template, jsonify, request
import json
from datetime import datetime

app = Flask(__name__)

# Mensajes dinámicos que pueden ser servidos desde el backend
MENSAJES_SECRETOS = [
    "Oso polar... si algún día dudas de lo mucho que te amo, vuelve aquí. Porque todo esto lo hice pensando en ti, en lo que eres para mí y en lo feliz que me haces. Eres mi presente bonito y mi futuro deseado.",
    "Cada momento contigo es un regalo que guardo en mi corazón.",
    "Eres la persona más increíble que he conocido, y me haces inmensamente feliz.",
    "Gracias por ser mi compañero, mi cómplice, mi amor.",
    "Contigo, cada día es una nueva aventura que quiero vivir."
]

MENSAJES_INTERACTIVOS = [
    "Eres mi tranquilidad en medio del caos.",
    "A tu lado aprendí que el amor sí puede ser bonito.",
    "No eres perfecto, pero eres perfecto para mí.",
    "Tu sonrisa ilumina mis días más oscuros.",
    "Me haces sentir como en casa, donde sea que estemos.",
    "Eres mi persona favorita en todo el mundo."
]

@app.route('/')
def index():
    """Renderiza la página principal"""
    return render_template('index.html')

@app.route('/api/mensaje-secreto')
def mensaje_secreto():
    """Endpoint para obtener un mensaje secreto aleatorio"""
    import random
    mensaje = random.choice(MENSAJES_SECRETOS)
    return jsonify({
        'mensaje': mensaje,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/mensaje-interactivo')
def mensaje_interactivo():
    """Endpoint para mensajes de los botones interactivos"""
    import random
    mensaje = random.choice(MENSAJES_INTERACTIVOS)
    return jsonify({
        'mensaje': mensaje,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/tarjetas')
def obtener_tarjetas():
    """Endpoint que devuelve los datos de las tarjetas"""
    tarjetas = [
        {
            'id': 1,
            'frente': 'Lo que más amo de ti...',
            'reverso': 'Tu forma de cuidarme, de hacerme sentir importante incluso en los días más simples. Contigo todo se siente más bonito, oso polar.'
        },
        {
            'id': 2,
            'frente': 'Cuando pienso en nosotros...',
            'reverso': 'Me imagino creciendo juntos, logrando todo lo que soñamos, construyendo algo real, algo fuerte... algo nuestro.'
        },
        {
            'id': 3,
            'frente': 'Gracias por...',
            'reverso': 'Quedarte, entenderme, apoyarme incluso cuando no soy perfecta. Tu paciencia y tu amor significan más de lo que a veces sé expresar.'
        }
    ]
    return jsonify(tarjetas)

@app.route('/api/galeria')
def obtener_galeria():
    """Endpoint que devuelve las 8 imágenes locales de Love is..."""
    
    # Mensajes personalizados para cada imagen (del 1 al 8)
    mensajes = [
        "Amor es reír contigo sin razón.",           # Para Love is 1.png
        "Amor es elegirte todos los días.",          # Para Love is 2.png
        "Amor es sentir paz cuando estás conmigo.",  # Para Love is 3.png
        "Amor es tenerte como mi lugar seguro.",     # Para Love is 4.png
        "Amor es cada momento a tu lado.",           # Para Love is 5.png
        "Amor es tu abrazo, mi refugio favorito.",   # Para Love is 6.png
        "Amor es mirarte y saber que todo estará bien.", # Para Love is 7.png
        "Amor es construir un mundo solo para dos."  # Para Love is 8.png
    ]
    
    galeria = []
    # Generamos la lista automáticamente para las 8 imágenes
    for i in range(1, 9):
        galeria.append({
            'id': i,
            # Flask sirve archivos en static automáticamente en la ruta /static/
            # Nota: Flask maneja los espacios en los nombres de archivo automáticamente
            'imagen': f'/static/images/Love is {i}.png', 
            'mensaje': mensajes[i-1]
        })
        
    return jsonify(galeria)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)