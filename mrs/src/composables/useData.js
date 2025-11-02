// 简化的数据库配置，移除了冗余的重复数据
export function generateDatabaseConfig() {
  return {
    hive: {
      'warehouse': {
        'dim_users': { fields: ['user_id', 'user_name', 'email', 'phone', 'create_time'] },
        'dim_products': { fields: ['product_id', 'product_name', 'category', 'price', 'create_time'] },
        'fact_orders': { fields: ['order_id', 'user_id', 'product_id', 'quantity', 'amount', 'order_time'] }
      },
      'analytics': {
        'user_behavior': { fields: ['user_id', 'action', 'page', 'timestamp', 'session_id'] },
        'sales_summary': { fields: ['date', 'total_sales', 'order_count', 'avg_order_value'] }
      }
    },
    clickhouse: {
      'logs': {
        'access_logs': { fields: ['timestamp', 'user_id', 'action', 'ip_address', 'user_agent'] },
        'error_logs': { fields: ['timestamp', 'error_code', 'message', 'service', 'severity'] }
      },
      'metrics': {
        'system_metrics': { fields: ['timestamp', 'cpu_usage', 'memory_usage', 'disk_io', 'network_io'] }
      }
    },
    elasticsearch: {
      'search': {
        'products_index': { fields: ['product_id', 'name', 'description', 'price', 'category'] },
        'users_index': { fields: ['user_id', 'username', 'email', 'profile_data'] }
      }
    },
    dws: {
      'warehouse': {
        'dws_user_summary': { fields: ['user_id', 'total_orders', 'total_spent', 'last_order_date'] }
      }
    }
  }
}

// 生成表数据的简化版本
export function generateTableData(tableName, dbType) {
  const fieldTypes = {
    user_id: 'BIGINT',
    user_name: 'VARCHAR',
    email: 'VARCHAR',
    phone: 'VARCHAR',
    create_time: 'TIMESTAMP',
    product_id: 'BIGINT',
    product_name: 'VARCHAR',
    category: 'VARCHAR',
    price: 'DECIMAL',
    order_id: 'BIGINT',
    quantity: 'INT',
    amount: 'DECIMAL',
    order_time: 'TIMESTAMP',
    action: 'VARCHAR',
    page: 'VARCHAR',
    timestamp: 'TIMESTAMP',
    session_id: 'VARCHAR',
    date: 'DATE',
    total_sales: 'DECIMAL',
    order_count: 'INT',
    avg_order_value: 'DECIMAL',
    ip_address: 'VARCHAR',
    user_agent: 'VARCHAR',
    error_code: 'VARCHAR',
    message: 'TEXT',
    service: 'VARCHAR',
    severity: 'VARCHAR',
    cpu_usage: 'FLOAT',
    memory_usage: 'FLOAT',
    disk_io: 'FLOAT',
    network_io: 'FLOAT',
    description: 'TEXT',
    profile_data: 'JSON',
    total_orders: 'INT',
    total_spent: 'DECIMAL',
    last_order_date: 'DATE'
  }

  const fields = generateDatabaseConfig()[dbType]?.[Object.keys(generateDatabaseConfig()[dbType])[0]]?.[tableName]?.fields || []

  return {
    tableName,
    rowCount: Math.floor(Math.random() * 1000000) + 10000,
    size: `${(Math.random() * 100 + 10).toFixed(2)} GB`,
    fields: fields.map(field => ({
      name: field,
      type: fieldTypes[field] || 'VARCHAR',
      nullable: Math.random() > 0.3,
      comment: `${field} 字段`,
      sampleValue: generateSampleValue(fieldTypes[field] || 'VARCHAR')
    })),
    partitions: ['year', 'month'],
    lastUpdated: new Date().toISOString().split('T')[0]
  }
}

function generateSampleValue(type) {
  if (type.includes('INT') || type.includes('BIGINT')) {
    return Math.floor(Math.random() * 10000).toString()
  } else if (type.includes('DECIMAL') || type.includes('FLOAT')) {
    return (Math.random() * 1000).toFixed(2)
  } else if (type.includes('TIMESTAMP') || type.includes('DATE')) {
    return new Date().toISOString().split('T')[0]
  } else if (type === 'JSON') {
    return '{"key": "value"}'
  } else {
    return `sample_${Math.random().toString(36).substr(2, 9)}`
  }
}