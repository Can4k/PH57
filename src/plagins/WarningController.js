import emitter from "@/plagins/emitter";

class WarningController {
    error(message) {
        const errorLife = 2000;

        emitter.emit('add_message', {
            severity: 'error',
            summary: 'Ошибка',
            detail: message,
            life: errorLife
        })
    }

    success(message) {
        const successLife = 2000;

        emitter.emit('add_message', {
            severity: 'success',
            summary: 'Успешно',
            detail: message,
            life: successLife
        })
    }
}

export default new WarningController()