<table>
    <tr>
        <td>VENTAS REALIZADAS</td>
    </tr>
    <thead>
        <tr>
            <th width="35" style="background:#ff7373">#</th>
            <th width="35" style="background:#ff7373">Cliente</th>
            <th width="35" style="background:#ff7373">Método de Pago</th>
            <th width="35" style="background:#ff7373">Tipo de moneda</th>
            <th width="35" style="background:#ff7373">Total</th>
            <th width="35" style="background:#ff7373">Nº de Transacción</th>
            <th width="35" style="background:#ff7373">Fecha de Registro</th>
            <th width="35" style="background:#ff7373">Region/Ciudad/Compañía</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($sales as $key => $sale)
            <tr>
                <td>{{$key + 1}}</td>
                <td>{{$sale->user->name . ' ' . $sale->user->surname}}</td>
                <td>{{$sale->method_payment}}</td>
                <td>{{$sale->currency_total}}</td>
                <td>{{$sale->total}} {{$sale->currency_payment}}</td>
                <td>{{$sale->code_transaction}}</td>
                <td>{{$sale->created_at->format("Y-m-d h:i:s")}}</td>
                <td>{{
            $sale->sale_addres?->country_region ?: '' . "/" .
            $sale->sale_addres?->city ?: '' . "/" .
            $sale->sale_addres?->company ?: ''
                                                                                }}
                </td>
            </tr>
        @endforeach
    </tbody>
</table>