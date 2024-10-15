using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class DatabaseController : ControllerBase
{
    private readonly DatabaseService _databaseService;

    public DatabaseController(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    [HttpGet]
    public IEnumerable<string> Get()
    {
        return _databaseService.GetData();
    }
}
