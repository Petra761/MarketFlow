using backend.Dominio.Interfaces;
using backend.Infraestructura.Repositorios;
using Marketflow.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Marketflow.Infraestructura.Repositorios;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using backend.API.Filters;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers(options =>
{
    // Mantiene tu filtro global de excepciones (HEAD)
    options.Filters.Add<ApiExceptionFilter>();
})
.AddJsonOptions(options =>
{
    // Mantiene la política de nombres camelCase (feature/adriana)
    options.JsonSerializerOptions.PropertyNamingPolicy = 
        System.Text.Json.JsonNamingPolicy.CamelCase;
});

builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MarketflowContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
    );
});

// Repositorios
builder.Services.AddScoped<IDetalle_PedidoRepositorio, Detalle_PedidoRepositorio>();

builder.Services.AddScoped<IMetodo_PagoRepositorio, Metodo_PagoRepositorio>();

builder.Services.AddScoped<IPedidoRepositorio, PedidoRepositorio>();

builder.Services.AddScoped<IStockRepositorio, StockRepositorio>();

builder.Services.AddScoped<IPrecioRepositorio, PrecioRepositorio>();

builder.Services.AddScoped<ITelefonoRepositorio, TelefonoRepositorio>();

builder.Services.AddScoped<ITelefono_UsuarioRepositorio, Telefono_UsuarioRepositorio>();

builder.Services.AddScoped<IIntento_LoginRepositorio, Intento_LoginRepositorio>();

builder.Services.AddScoped<IProductoRepositorio, ProductoRepositorio>();

builder.Services.AddScoped<ICategoriaRepositorio, CategoriaRepositorio>();

builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();

builder.Services.AddScoped<IRolRepositorio, RolRepositorio>();

builder.Services.AddScoped<IReporteAdminRepositorio, ReporteRepositorio>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MarketflowContext>();
    try
    {
        await context.Database.ExecuteSqlRawAsync(
            "ALTER TABLE \"Producto\" ADD COLUMN IF NOT EXISTS \"Imagen\" TEXT;"
        );
        Console.WriteLine("--> Base de datos: Columna 'Imagen' verificada/creada con éxito.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> Error al actualizar base de datos: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();

    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapScalarApiReference();

app.UseCors("AllowAll");

// Errores de negocio en /api/* siempre responden JSON (evita la pantalla amarilla de Development).
app.Use(async (context, next) =>
{
    if (!context.Request.Path.StartsWithSegments("/api"))
    {
        await next();
        return;
    }

    try
    {
        await next();
    }
    catch (Exception ex)
    {
        if (context.Response.HasStarted)
            throw;

        var statusCode = ex.Message.Contains("ya está registrado", StringComparison.OrdinalIgnoreCase)
            ? StatusCodes.Status409Conflict
            : StatusCodes.Status400BadRequest;

        context.Response.Clear();
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json; charset=utf-8";
        await context.Response.WriteAsJsonAsync(new { mensaje = ex.Message });
    }
});

app.MapControllers();

app.Run();
