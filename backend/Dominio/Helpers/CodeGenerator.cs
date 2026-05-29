using System;

namespace backend.Dominio.Helpers
{
    public static class CodeGenerator
    {
        private static readonly char[] _chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".ToCharArray();

        public static string Generate(string prefix, int length = 4)
        {
            var random = new Random();
            var result = new char[length];
            for (int i = 0; i < length; i++)
            {
                result[i] = _chars[random.Next(_chars.Length)];
            }
            return $"{prefix}-{new string(result)}";
        }
    }
}
