import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

export async function question(text: string, title?: string) {
  const result = await withReactContent(Swal).fire({
    icon: 'question',
    text: text,
    title: title || undefined,
    showCancelButton: true,
    confirmButtonColor: '#B40019',
    cancelButtonColor: '#F3F3F9',
  });
  return result.isConfirmed;
}

export function error(text: string, title?: string) {
  return withReactContent(Swal).fire({ icon: 'error', text: text, title: title || undefined });
}

export function success(text: string, title?: string) {
  return withReactContent(Swal).fire({ icon: 'success', text: text, title: title || undefined });
}

export function warning(text: string, title?: string) {
  return withReactContent(Swal).fire({ icon: 'warning', text: text, title: title || undefined });
}

export function info(text: string, title?: string) {
  return withReactContent(Swal).fire({
    icon: 'info',
    text: text,
    title: title || undefined,
    confirmButtonColor: '#313970',
  });
}
