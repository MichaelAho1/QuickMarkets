# Generated by Django 5.2.1 on 2025-05-10 19:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('simulator', '0007_rename_stock_stockpricehistory_stockticker_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shares', models.FloatField()),
                ('transactionType', models.CharField(choices=[('BUY', 'Buy'), ('SELL', 'Sell')], max_length=4)),
                ('priceAtTransaction', models.FloatField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='simulator.stock')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='simulator.user')),
            ],
        ),
    ]
