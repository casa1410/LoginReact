import React, { useState, useEffect } from 'react'

import appFirebase from '../credenciales'
import { getAuth, signOut } from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'

const auth = getAuth(appFirebase)
const db = getFirestore(appFirebase)

const Home = ({ correoUsuario }) => {

  const valorInicial = {
    nombre: '',
    edad: '',
    mantenimientoin: '',
    mantenimientomu: '',
    servicios: ''
  }

  //Variables de estado
  const [user, setUser] = useState(valorInicial)
  const [lista, setLista] = useState([])
  const [subId, setSubId] = useState('')

  //Funciones para los inputs

  const capturarInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value })
  }

  //funcionalidad para actualizar o guardar datos


  const guardarDatos = async (e) => {
    e.preventDefault();
    //console.log(user);

    if (subId === '') {
      try {
        await addDoc(collection(db, 'usuarios'), {
          ...user
        })
      } catch (error) {
        console.log(error);
      }
    } else {
      await setDoc(doc(db, "usuarios", subId), {
        ...user
      })
    }
    setUser({ ...valorInicial })
    setSubId('')
  }

  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'))
        const docs = []
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id })
        })
        setLista(docs)
      } catch (error) {
        console.log(error)
      }
    }
    getLista()
  }, [lista]);

  //funcion para eliminar el usuario
  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "usuarios", id))
  }

  const getOne = async (id) => {
    try {
      const docRef = doc(db, "usuarios", id)
      const docSnap = await getDoc(docRef)
      setUser(docSnap.data())
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (subId !== '') {
      getOne(subId)
    }
  }, [subId])

  return (
    <div className='container'>
      <p>Bienvenido, <strong>{correoUsuario}</strong> Haz iniciado sesión </p>

      <button className='btn btn-primary' onClick={() => signOut(auth)}>
        Cerrar sesión
      </button>

      <hr />

      <div className='row'>
        {/*Esta seccion sera el formulario*/}
        <div className='col-md-4'>
          <h3 className='text-center mb-3'>Ingresar usuario</h3>
          <form onSubmit={guardarDatos}>
            <div className='card card-body'>
              <div className='form-group'>
                <input type="text" name='nombre' className='form-control mb-3' placeholder='Ingresa el nombre del usuario' onChange={capturarInputs} value={user.nombre} />

                <input type="text" name='edad' className='form-control mb-3' placeholder='Ingresa la edad del usuario' onChange={capturarInputs} value={user.edad} />

                {/*<input type="text" name='mantenimientoin' className='form-control mb-3' placeholder='Ingresa la mantenimientoin del usuario' onChange={capturarInputs} value={user.mantenimientoin} />*/}

                <select class="form-select" aria-label="Default select example" name='mantenimientoin' className='form-control mb-3' onChange={capturarInputs} value={user.mantenimientoin}>
                  <option selected>Seleccione un trabajo de inmueble</option>
                  <option value='Baños'>Baños</option>
                  <option value='Cielo raso'>Cielo raso</option>
                  <option value='Eléctrico'>Eléctrico</option>
                  <option value='Pared'>Pared</option>
                  <option value='Puerta'>Puerta</option>
                </select>

                <select class="form-select" aria-label="Default select example" name='mantenimientomu' className='form-control mb-3' onChange={capturarInputs} value={user.mantenimientomu}>
                  <option selected>Seleccione un trabajo de mueble</option>
                  <option value='Aire acondicionado'>Aire acondicionado</option>
                  <option value='Archivador'>Archivador</option>
                  <option value='Puesto de trabajo'>Puesto de trabajo</option>
                  <option value='Silla'>Silla</option>
                </select>

                <select class="form-select" aria-label="Default select example" name='servicio' className='form-control mb-3' onChange={capturarInputs} value={user.servicio}>
                  <option selected>Seleccione un servicio</option>
                  <option value='Aseo'>Aseo</option>
                  <option value='Transporte'>Transporte</option>
                  <option value='Vigilancia'>Vigilancia</option>
                </select>

              </div>
              <button className='btn btn-primary'>
                {subId === '' ? 'Guardar' : 'Actualizar'}
              </button>
            </div>
          </form>
        </div>
        {/*Esta seccion sera la lista de los usuarios*/}
        <div className='col-md-8'>
          <h2 className='text-center mb-5'>Lista de usuarios</h2>

          <div className='container card'>
            <div className='card-body'>
              {
                lista.map(list => (
                  <div key={list.id}>
                    <p>Nombre: {list.nombre}</p>
                    <p>Edad: {list.edad}</p>
                    <p>Mantenimiento inmueble: {list.mantenimientoin}</p>
                    <p>Mantenimiento mueble: {list.mantenimientomu}</p>
                    <p>Servicios: {list.servicio}</p>

                    <button className='btn btn-danger' onClick={() => deleteUser(list.id)}>
                      Eliminar
                    </button>

                    <button className='btn btn-success m-1' onClick={() => setSubId(list.id)}>
                      Actualizar
                    </button>
                    <hr />
                  </div>
                ))
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home