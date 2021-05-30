import { Component, OnInit } from '@angular/core';
import { ApiServiceProvider } from 'src/providers/api-service/api-service';
import { Alumno } from '../modelo/Alumno';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private alumnos = new Array<Alumno>();

  constructor(private apiService: ApiServiceProvider, public alertController: AlertController) {
  }

  /* cuando se carga la pantalla se llama al método getAlumnos de la Api. Este es un método asíncrono que devuelve un objeto Promise del que debe ser evaluado el resultado.
    Si el acceso a la Api ha ido bien se ejecuta el código asociado a la cláusula then.  Símplemente se coge el array de alumnos que llega y se asocia a él el atributo alumnos de la clase.
    Si ha ido mal el acceso (por ejemplo si no hemos lanzado jsonServer) se coge el error que llega y se muestra por consola. */

  ngOnInit(): void {
    this.apiService.getAlumnos()
      .then((alumnos: Alumno[]) => {
        this.alumnos = alumnos;
        console.log(this.alumnos);
      })
      .catch((error: string) => {
        console.log(error);
      });
  }



  /* este método llama al método eliminarAlumno de la Api y le pasa el id del alumno a eliminar. Se devuelve un objeto Promise.
   Si el borrado ha ido bien se ejecuta el código asociado a la cláusula then. Símplemente se muestra por consola un mensaje y
   se elimina el alumno del array de alumnos de la clase, lo que hará que deje de verse en la vista.
   Si el borrado ha ido mal muestro por consola el error que ha ocurrido.
  */

  eliminarAlumno(indice: number) {
    this.apiService.eliminarAlumno(this.alumnos[indice].id)
      .then((correcto: boolean) => {
        console.log("Borrado correcto del alumno con indice: " + indice);
        this.alumnos.splice(indice, 1);
      })
      .catch((error: string) => {
        console.log("Error al borrar: " + error);
      });
  }//end_eliminar_alumno

  /* A continuación pondremos para cada fila de la lista un botón que al ser pulsado mostrará en una
   ventana emergente todos los datos del alumno en cajas de texto para permitir su modificación.
    Al método se le pasará como parámetro el índice del alumno que se va a modificar. */
  async modificarAlumno(indice: number) {
    let alumno = this.alumnos[indice];
    const alert = await this.alertController.create({
      header: 'Modificar',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          value: alumno.first_name,
          placeholder: 'first_name'
        },
        {
          name: 'last_name',
          type: 'text',
          id: 'last_name',
          value: alumno.last_name,
          placeholder: 'last_name'
        },
        {
          name: 'email',
          id: 'email',
          type: 'text',
          value: alumno.email,
          placeholder: 'email'
        },
        {
          name: 'gender',
          id: 'gender',
          type: 'text',
          value: alumno.gender,
          placeholder: 'gender'
        },
        {
          name: 'avatar',
          value: alumno.avatar,
          type: 'url',
          placeholder: 'avatar'
        },
        {
          name: 'address',
          value: alumno.address,
          type: 'text',
          placeholder: 'address'
        },
        {
          name: 'city',
          value: alumno.city,
          type: 'text',
          placeholder: 'city'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log(data);
            var alumnoModificado: Alumno = new Alumno(alumno.id,
              data['first_name'],
              data['last_name'],
              data['email'],
              data['gender'],
              data['avatar'],
              data['address'],
              data['city'],
              data['address']);
            this.apiService.modificarAlumno(alumno.id, alumnoModificado)
              .then((alumno: Alumno) => {
                this.alumnos[indice] = alumno;
              })
              .catch((error: string) => {
                console.log(error);
              });
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }//end_modificarAlumno


}//end_class