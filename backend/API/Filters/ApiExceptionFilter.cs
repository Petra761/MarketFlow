using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.API.Filters;

/// <summary>
/// Convierte excepciones de negocio del repositorio en respuestas JSON
/// para que el frontend nunca reciba la pantalla amarilla de Development.
/// </summary>
public class ApiExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var message = context.Exception.Message;

        var statusCode = message.Contains("ya está registrado", StringComparison.OrdinalIgnoreCase)
            ? StatusCodes.Status409Conflict
            : StatusCodes.Status400BadRequest;

        context.Result = new ObjectResult(new { mensaje = message })
        {
            StatusCode = statusCode,
        };
        context.ExceptionHandled = true;
    }
}
