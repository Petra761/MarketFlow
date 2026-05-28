using backend.Dominio.Interfaces;
using backend.Infraestructura.Repositorios;
using Marketflow.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Marketflow.Infraestructura.Repositorios;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();

    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapScalarApiReference();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();
