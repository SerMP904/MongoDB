// EJERCICIOS FUNCIÓN aggregate (BBDD "Tienda" / colección "moviles")

use("Tienda");

// Ejercicio 1:
// Utilizando aggregate, filtra los móviles cuyo precio sea mayor o igual que 900
// y muestra todos sus campos.
/*
db.moviles.aggregate([{
    $match: {
      'precio': {$gte : 900}
    }
}
])
*/
// Ejercicio 2:
// Utilizando aggregate, filtra los móviles de la marca "Samsung" cuyo precio
// sea menor que 1000.
/*
db.moviles.aggregate([{
    $match: {
        'marca': 'Samsung',
        'precio': {$gte : 900}}
      }
])*/

// Ejercicio 3:
// Muestra únicamente el modelo y el precio de todos los móviles utilizando $project,
// ocultando el campo _id.
/*
db.moviles.aggregate([{
  $project: {
      _id: 0,
    }
    }
])*/

// Ejercicio 4:
// Muestra modelo y precio de todos los móviles y añade un campo llamado "esCaro"
// que valga true si el precio es mayor o igual que 1000 y false en caso contrario.
/*
db.moviles.aggregate([{
  $project: {
    _id: 0,
    modelo: 1,
    precio: 1,
    esCaro: {
      $cond: {
        if: {$gt: ["$precio", 1000]}, then: true, else: false
      }
    }
  }
}
])*/

// Ejercicio 5:
// Usando $unwind sobre el array opiniones, muestra una fila por cada opinión de cada móvil,
// proyectando el modelo, el usuario de la opinión y la puntuación.
/*
db.moviles.aggregate([{
  $unwind: '$opiniones'
},{
  $project: {
    _id: "$opiniones",
    modelo: 1,
    usuario: 1,
    puntuacion: 1
  }
}
])*/

// Ejercicio 6:
// Usando $unwind y $match, muestra el modelo y la puntuación de todas las opiniones
// con puntuacion mayor o igual que 4.8.
/*
db.moviles.aggregate([
  {
    $unwind: "$opiniones",
  },
  {
    $match: {
      "opiniones.puntuacion": { $gte: 4.8 },
    },
  },
  {
    $project: {
      _id: 0,
      modelo: 1,
      puntuacion: "$opiniones.puntuacion",
    },
  },
]);
*/
// Ejercicio 7:
// Agrupa los móviles por marca y muestra cuántos modelos hay de cada una,
// usando $group para calcular el total de modelos por marca.
/*
db.moviles.aggregate([{
  $group: {
    _id: 0,
    marca: "$_id",
    totalModelos: {$sum: 1}
  }
}])*/

// Ejercicio 8:
// Agrupa los móviles por marca y calcula el precio medio de cada marca.
// Después, con $project, muestra la marca y el precioMedio renombrando el campo _id a marca.
/*
db.moviles.aggregate([{
  $group: {
    _id: "$marca",
    precioMedio: {$avg: "$precio"}
  }
},{
  $project: {
    _id: 0,
    marca: "$_id",
    precioMedio: 1
  }
}])*/

// Ejercicio 9:
// Deshaz el array de opiniones con $unwind y agrupa por marca para obtener la
// puntuacionMedia de las opiniones de cada marca, usando $avg sobre opiniones.puntuacion.
/*
db.moviles.aggregate([
  {
    $unwind: "$opiniones",
  },
  {
    $group: {
      _id: "$marca",
      puntuacionMedia: { $avg: "$opiniones.puntuacion" },
    },
  },
  {
    $project: {
      _id: 0,
      marca: "$_id",
      puntuacion: "$puntuacionMedia",
    },
  },
]);*/

// Ejercicio 10:
// Ordena todos los móviles por precio de menor a mayor utilizando aggregate y $sort.
/*
db.moviles.aggregate([
  {$project: {
    _id: 0,
  }
},{
  $sort: {precio: 1}
}])*/

// Ejercicio 11:
// Calcula el precio medio por marca usando $group y ordena el resultado
// por precioMedio de mayor a menor.
/*
db.moviles.aggregate([
  {
    $group: {
      _id: "$marca",
      precioMedio: { $avg: "$precio" },
    },
  },
  {
    $sort: { precioMedio: 1}
  }
]);
*/
// Ejercicio 12:
// Muestra únicamente los 3 móviles más caros utilizando $sort y $limit dentro de aggregate.
/*
db.moviles.aggregate([
  {
    $sort: { precio: 1 },
  },
  { $limit: 3 },
]);
*/
// Ejercicio 13:
// Usa $project y $cond para mostrar modelo, precio y un campo "rangoPrecio" que valga
// "Alto" si el precio es mayor o igual que 1000, y "Medio/Bajo" en caso contrario.

db.moviles.aggregate([
  {
    $project: {
      _id: 0,
      modelo: 1,
      precio: 1, 
      rangoPrecio: {
        $cond: {
          if: {$gte: ["$precio", 1000]},
          then: "Alto",
          else: "Medio/Bajo",
        }
    }
  },
}
]);

// Ejercicio 14:
// Agrupa por marca para obtener el precioMedio y, usando $project y $cond,
// clasifica cada marca como "Premium" si precioMedio es mayor que 900,
// o "Estándar" en caso contrario.

db.moviles.aggregate([
  {$group:{
    _id: "$marca",
    precioMedio: { $avg: "$precio"}
  }
  },
  {
    $project: {
      _id: 0,
      marca: {
        $cond: {
          if: {$gte: ["$precioMedio", 900]},
          then: "Premium",
          else: "Estandar",
        }
    }
  },
}
]);

// Ejercicio 15:
// Crea un pipeline completo que:
//  - Filtre móviles con precio mayor o igual que 800.
//  - Proyecte solo marca, modelo, precio y opiniones.
//  - Deshaga el array de opiniones con $unwind.
//  - Agrupe por marca calculando precioMedio y puntuacionMedia de opiniones.
//  - Proyecte marca, precioMedio, puntuacionMedia y un campo "categoriaPrecio"
//    con "Gama alta" si precioMedio es mayor o igual que 1000 o "Gama media" si no.
//  - Ordene por puntuacionMedia de mayor a menor.
//  - Limite el resultado a las 5 primeras marcas.

db.moviles.aggregate([
  {
    $match: {
        'precio': {$gte : 800}
    }
  },
  {
    $project: {
      _id: 0,
      marca: 1,
      modelo: 1,
      precio: 1,
      opiniones: 1
    }
  },{
    $unwind: "$opiniones"
  },
  { $group:{
    _id: "$marca",
    precioMedio: {$avg: "$precio"},
    puntuacionMedia: {$avg: "$opiniones.puntuacion"}
  }},{
    $project: {
      _id: 0,
      marca: 1,
      precioMedio: 1,
      puntuacionMedia: 1,
      categoriaPrecio: {
        $cond: { if: {$gte: ["$precioMedio",1000]},
        then: "Gama Alta",
        else: "Gama Media"}
      }
    }
  },
  {
    $sort: {puntuacionMedia: -1}
  },
  {
    $limit: 5
  }
])

