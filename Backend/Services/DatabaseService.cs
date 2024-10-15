using MySql.Data.MySqlClient;
using System.Collections.Generic;

public class DatabaseService(string connectionString)
{
    private readonly string _connectionString = connectionString;

    public List<string> GetData()
    {
        List<string> data = [];

        using (MySqlConnection conn = new(_connectionString))
        {
            conn.Open();
            string query = "SELECT * FROM users"; // Replace with your actual table

            using MySqlCommand cmd = new(query, conn);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                data.Add(reader.GetString(0)); // Adjust based on your table's columns
            }
        }

        return data;
    }
}
