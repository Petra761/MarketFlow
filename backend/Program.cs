using Marketflow.Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using backend.Dominio.Interfaces;
using backend.Infraestructura.Repositorios;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// OpenAPI + Scalar
builder.Services.AddOpenApi();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext PostgreSQL
builder.Services.AddDbContext<MarketflowContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Repositorios
builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();

builder.Services.AddScoped<IRolRepositorio, RolRepositorio>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
    );
});

var app = builder.Build();

// Swagger + Scalar
if (app.Environment.IsDevelopment())
{
    // OpenAPI
    app.MapOpenApi();

    // Swagger
    app.UseSwagger();

    app.UseSwaggerUI();

    app.UseHttpsRedirection();
}

// CORS
app.UseCors("AllowAll");

// Controllers
app.MapControllers();

// Scalar
app.MapScalarApiReference();

app.Run();

