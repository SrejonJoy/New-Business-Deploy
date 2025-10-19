<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'discount_percent')) {
                $table->decimal('discount_percent', 8, 2)->nullable()->after('price');
            }
            if (!Schema::hasColumn('products', 'discount_fixed')) {
                $table->decimal('discount_fixed', 10, 2)->nullable()->after('discount_percent');
            }
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['discount_percent', 'discount_fixed']);
        });
    }
};
