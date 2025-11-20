#!/bin/bash

echo "🔍 فحص متقدم لاستخدامات Services..."
echo "=" * 80

# List of all services
services=(
    "HoldingService"
    "ProjectService"
    "UnitService"
    "DepartmentService"
    "CustomerService"
    "SupplierService"
)

for service in "${services[@]}"; do
    plural="${service}s"
    
    # Check if plural version is used anywhere
    count=$(grep -r "$plural" apps/platform-shell-ui/src/app/ --include="*.ts" 2>/dev/null | grep -v "\.service\.ts" | wc -l)
    
    if [ $count -gt 0 ]; then
        echo "⚠️  $service → $plural used in $count places"
        grep -r "$plural" apps/platform-shell-ui/src/app/ --include="*.ts" 2>/dev/null | grep -v "\.service\.ts" | head -3
        echo ""
    fi
done
