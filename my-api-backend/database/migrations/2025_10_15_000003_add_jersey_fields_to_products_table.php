<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('product_id')->unique()->nullable()->after('id');
            $table->string('name')->nullable()->after('product_id');
            $table->string('team_name')->nullable();
            $table->string('year')->nullable();
            $table->enum('jersey_type', ['cricket', 'football'])->nullable();
            $table->string('league')->nullable();
            $table->decimal('prev_price', 10, 2)->nullable();
            $table->boolean('in_stock')->default(true);
            $table->string('size_chart')->nullable();
            $table->json('sizes')->nullable();
            $table->integer('shipping_time_days')->nullable();
            $table->string('brand')->nullable();
            $table->string('country_of_origin')->nullable();
            $table->string('fabric')->nullable();
            $table->json('details')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'product_id', 'name', 'team_name', 'year', 'jersey_type', 'league', 'prev_price',
                'in_stock', 'size_chart', 'sizes', 'shipping_time_days', 'brand', 'country_of_origin',
                'fabric', 'details'
            ]);
        });
    }
};
