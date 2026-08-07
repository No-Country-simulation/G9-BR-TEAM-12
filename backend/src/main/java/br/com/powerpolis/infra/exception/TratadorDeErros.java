package br.com.powerpolis.infra;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TratadorDeErros {

    // 400 - Erro de validação dos DTOs
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> tratarErro400(MethodArgumentNotValidException ex) {
        var erros = ex.getFieldErrors();

        return ResponseEntity.badRequest()
                .body(erros.stream().map(DadosErroValidacao::new).toList());
    }

    // 503 - Serviço Python indisponível
    @ExceptionHandler(PythonServiceUnavailableException.class)
    public ResponseEntity<?> tratarErroServicoPython(
            PythonServiceUnavailableException ex) {

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ex.getMessage());
    }

    // 500 - Erro genérico
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> tratarErro500(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor.");
    }

    // TODO:
    // Definir como tratar tipo_imovel inválido.
    // Aguardando decisão da equipe de Data Science:
    // - rejeitar com 400; ou
    // - aceitar como categoria genérica.

    private record DadosErroValidacao(String campo, String mensagem) {
        public DadosErroValidacao(FieldError erro) {
            this(erro.getField(), erro.getDefaultMessage());
        }
    }

    // Exceção personalizada para python
    public static class PythonServiceUnavailableException
            extends RuntimeException {

        public PythonServiceUnavailableException(String mensagem) {
            super(mensagem);
        }

        public PythonServiceUnavailableException(
                String mensagem, Throwable causa) {
            super(mensagem, causa);
        }
    }
}