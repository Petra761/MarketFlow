import type { VentaRangoDTO } from "../../types/reportes";

interface Props {
    ventas: VentaRangoDTO[];
}

export default function ARTablaVentasRango({
    ventas
}: Props) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Periodo</th>
                    <th>Total Ventas</th>
                    <th>Cantidad Ventas</th>
                </tr>
            </thead>

            <tbody>
                {ventas.map((venta) => (
                    <tr key={venta.periodo}>
                        <td>{venta.periodo}</td>

                        <td>
                            Bs. {venta.totalVentas.toFixed(2)}
                        </td>

                        <td>
                            {venta.cantidadVentas}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}