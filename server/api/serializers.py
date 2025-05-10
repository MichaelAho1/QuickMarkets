from django.contrib.auth.models import User 
from rest_framework import serializers
from simulator.models import User as SimulatorUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} 

    def create(self, validated_data): 
        user = User.objects.create_user(**validated_data)
        
        SimulatorUser.objects.create(
            username=user.username,
            cashBalance=10000.00
        )

        return user