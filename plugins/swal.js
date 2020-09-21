import Vue from "vue";
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import 'sweetalert2/dist/sweetalert2.min.css'


export default (context, inject) => {

  Swal.toast = (title, icon, position, timeout) => {
     title = title || 'Выполнено!';
     icon = icon || 'success';
     timeout = timeout || 3000;
     position = position || 'top-end';

     Swal.fire({title: title, icon: icon,  
                  toast: true,
                  position: position,
                  showConfirmButton: false,
                  timer: timeout,
                  timerProgressBar: true,
                  onOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                  }

              });
  };


  Swal.loader = (title, text, timeout) => {
     title = title || 'Идет загрузка...';
     text = text || 'Ждите...';
     timeout = timeout || 9000;

     Swal.fire({title: title, html: text, timer: timeout, timerProgressBar: true, allowOutsideClick:false, allowEscapeKey:false, 
                 onBeforeOpen: () => {
                   Swal.showLoading()
                 }
              });
  }

  inject('swal', Swal);
}
