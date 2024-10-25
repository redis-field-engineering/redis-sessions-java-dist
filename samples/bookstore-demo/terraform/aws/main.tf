provider "aws" {
  region = "${var.aws_region}"
}

resource "aws_key_pair" "sshKey" {
    key_name = "sessions-test-ssh-key"
    public_key = file("${var.ssh_key_file}")  
}

resource "aws_instance" "fe-sessions-test-vm" {
  ami           = "ami-02b71e4c18caedcb5"
  instance_type = "t2.medium"
  key_name = aws_key_pair.sshKey.key_name  

  tags = {
    name = "fe-sessions-test-vm"
  }

  user_data = <<-EOF
#!/bin/bash
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk git docker.io docker-compose

sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

#start Docker service

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

git clone https://@github.com/redis-field-engineering/redis-sessions-java-dist
cd redis-sessions-java-dist/samples/bookstore-demo
./mvnw clean package
docker compose up -d
  EOF
}

data "aws_route53_zone" "redisdemo_zone"{
    name = "${var.aws_dns_zone}"
}

resource "aws_route53_record" "fe-sessions-test-vm-a-record" {
  zone_id = data.aws_route53_zone.redisdemo_zone.zone_id
  name = "bookstore"
  type = "A"
  ttl = "300"
  records = [aws_instance.fe-sessions-test-vm.public_ip]
  depends_on = [aws_instance.fe-sessions-test-vm]
}