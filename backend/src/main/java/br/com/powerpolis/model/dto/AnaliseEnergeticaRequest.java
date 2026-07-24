package br.com.powerpolis.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Corpo de entrada de POST /analise-energetica.
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

    @JsonProperty("temperatura")
    @NotNull(message = "temperatura é obrigatória")
    @DecimalMin(value = "15.0", message = "temperatura deve estar entre 15 e 35")
    @DecimalMax(value = "35.0", message = "temperatura deve estar entre 15 e 35")
    private Double temperatura;

    @JsonProperty("ar_condicionado")
    @NotNull(message = "ar_condicionado é obrigatório")
    private Boolean arCondicionado;
}
