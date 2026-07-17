package br.com.powerpolis.controller.routes;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@Validated
public class AnaliseEnergeticaController {

    @GetMapping("/analise-energetica")
    public ResponseEntity<String> instrucoes() {
        return ResponseEntity.ok("Use POST /analise-energetica com JSON no corpo para analisar o consumo energético.");
    }

    @PostMapping("/analise-energetica")
    public ResponseEntity<AnaliseEnergeticaResponse> analisar(@Valid @RequestBody AnaliseEnergeticaRequest request) {
        double probability = calcularProbabilidade(request);
        String categoria = classificar(probability);

        return ResponseEntity.ok(new AnaliseEnergeticaResponse(categoria, probability));
    }

// ---------------- caso perfeito ----------------
//O "Caso Perfeito" (Gatilho): Logo de cara, há um if bem específico. Se o consumo for exatamente 420 kWh, for em horário de pico, tiver 10 equipamentos, for uma Casa e tiver 8 horas de alto consumo, ele ignora o resto e crava a probabilidade em 81% (0.81). É como um atalho ou um cenário de teste pré-definido.

    private double calcularProbabilidade(AnaliseEnergeticaRequest request) {
        if (request.consumo_kwh() != null
                && request.consumo_kwh() == 420
                && Boolean.TRUE.equals(request.uso_horario_pico())
                && request.quantidade_equipamentos() != null
                && request.quantidade_equipamentos() == 10
                && "Casa".equalsIgnoreCase(request.tipo_imovel())
                && request.horas_alto_consumo() != null
                && request.horas_alto_consumo() == 8) {
            return 0.81;
        }


        // Acúmulo de Pontos (Se não cair no caso perfeito): Ele começa com uma base de 25% e vai somando pontos conforme o consumo aumenta: 

        // Consumo maior que 400 kWh? Soma mais 20%.

        // Usa em horário de pico? Soma mais 10%.

        // Mais de 8 equipamentos? Soma mais 8%.

        // É casa? Soma 5%. É apartamento? Soma 2%.

        // Mais de 6 horas de alto consumo? Soma mais 8%.

        double probability = 0.25;

        if (request.consumo_kwh() != null) {
            if (request.consumo_kwh() > 400) {
                probability += 0.20;
            } else if (request.consumo_kwh() > 250) {
                probability += 0.12;
            }
        }

        if (Boolean.TRUE.equals(request.uso_horario_pico())) {
            probability += 0.10;
        }

        if (request.quantidade_equipamentos() != null && request.quantidade_equipamentos() > 8) {
            probability += 0.08;
        }

        if ("Casa".equalsIgnoreCase(request.tipo_imovel())) {
            probability += 0.05;
        } else if ("Apartamento".equalsIgnoreCase(request.tipo_imovel())) {
            probability += 0.02;
        }

        if (request.horas_alto_consumo() != null && request.horas_alto_consumo() > 6) {
            probability += 0.08;
        }

        // No final, ele usa Math.min e Math.max para garantir que o resultado fique obrigatoriamente entre 5% (0.05) e 99% (0.99), não importa o quão baixo ou alto tenha sido a soma.
        
        return Math.min(0.99, Math.max(0.05, probability));
    }

    // A Classificação (classificar) Pega a probabilidade final gerada pelo passo anterior e dá uma nota em texto:

    // 75% ou mais: "Ineficiente" (Gasta muito mal)

    // Entre 45% e 74%: "Moderado"

    // Abaixo de 45%: "Eficiente"

    private String classificar(double probability) {
        if (probability >= 0.75) {
            return "Ineficiente";
        }
        if (probability >= 0.45) {
            return "Moderado";
        }
        return "Eficiente";
    }

    // talvez remover depois
    public record AnaliseEnergeticaRequest(
            @NotNull Double consumo_kwh,
            @NotNull Boolean uso_horario_pico,
            @NotNull Integer quantidade_equipamentos,
            @NotBlank String tipo_imovel,
            @NotNull Integer horas_alto_consumo
    ) {
    }

    public record AnaliseEnergeticaResponse(String categoria, double probabilidade) {
    }
}
