import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Request is on its way");
    return next(req).pipe(
      catchError((err) => {
       

        if (err.status && !(err.status === 200)) {
          Swal.fire({
            icon: 'warning',
            position: 'center',
            text:  'error' ,
            title:err.error,
            showConfirmButton: false,
            timer: 5000,
          });
        }

        if (err.status === 0) {
          Swal.fire({
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
            position: 'top-start',
            text:'Error connecting to server',
            showCancelButton: false,
            showCloseButton: false,
          });
        }
        if (err.status === 404 || err.status === 400) {
          console.log(err)
          Swal.fire({
            icon: 'warning',
            position: 'center',
            text:  err.error ,
            title:err.error,
            showConfirmButton: false,
            timer: 5000,
          });
          
        }

        const error = err.error
          ? err.error.message || err.statusText
          : err.status;
        return throwError(error);
      })
    );
  }

