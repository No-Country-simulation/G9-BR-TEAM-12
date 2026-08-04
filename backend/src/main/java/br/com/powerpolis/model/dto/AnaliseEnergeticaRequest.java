package br.com.powerpolis.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * Corpo de entrada de POST /analise-energetica.
 * Schema fixo pelo contrato-api.md v0.7. Apenas os 5 campos do edital.
 */

@Data
public class AnaliseEnergeticaRequest {

    @JsonProperty("consumo_kwh")
    @NotNull(message = "consumo_kwh é obrigatório")
    @Positive(message = "consumo_kwh deve ser maior que zero")
    private Double consumoKwh;

    @JsonProperty("uso_horario_pico")
    @NotNull(message = "uso_horario_pico é obrigatório")
    private Boolean usoHorarioPico;

    @JsonProperty("quantidade_equipamentos")
    @NotNull(message = "quantidade_equipamentos é obrigatório")
    @Min(value = 0, message = "quantidade_equipamentos não pode ser negativo")
    private Integer quantidadeEquipamentos;

    @JsonProperty("tipo_imovel")
    @NotNull(message = "tipo_imovel é obrigatório")
    private TipoImovel tipoImovel;

    @JsonProperty("horas_alto_consumo")
    @NotNull(message = "horas_alto_consumo é obrigatório")
    @DecimalMin(value = "0.0", message = "horas_alto_consumo deve estar entre 0 e 24")
    @DecimalMax(value = "24.0", message = "horas_alto_consumo deve estar entre 0 e 24")
    private Double horasAltoConsumo;
}