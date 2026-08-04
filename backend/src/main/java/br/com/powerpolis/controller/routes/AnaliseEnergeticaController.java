package br.com.powerpolis.controller.routes;

import br.com.powerpolis.model.dto.AnaliseEnergeticaRequest;
import br.com.powerpolis.model.dto.AnaliseEnergeticaResponse;
import br.com.powerpolis.service.AnaliseEnergeticaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequiredArgsConstructor
public class AnaliseEnergeticaController {

    private final AnaliseEnergeticaService service;

    // Recebe os 5 campos do contrato externo e repassa ao serviço de IA.
    @PostMapping("/analise-energetica")
    public ResponseEntity<AnaliseEnergeticaResponse> analisar(
            @Valid @RequestBody AnaliseEnergeticaRequest request) {
        return ResponseEntity.ok(service.analisar(request));
    }

    // Consulta o histórico no Autonomous Database — implementação pendente.
    @GetMapping("/analise-energetica/{id}")
    public ResponseEntity<AnaliseEnergeticaResponse> consultar(@PathVariable String id) {
        return ResponseEntity.ok(service.consultarPorId(id));
    }
}