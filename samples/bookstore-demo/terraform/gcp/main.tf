provider "google" {
    project = "${var.gcp-project}"
    region  = "${var.gcp-region}"
}

resource "google_compute_instance" "redis-sessions-java-bookstore-demo-vm"{
    machine_type = "n2-standard-8"
    name         = "redis-sessions-java-bookstore-demo-vm"
    zone         = "${var.gcp-zone}"

    boot_disk {
        initialize_params {
            image = "ubuntu-2004-focal-v20240731"
            size = 50
        }

        auto_delete = true
    }

    network_interface {
        network = "default"
        access_config {
        }
    }

    metadata_startup_script = <<-EOT
    #!/bin/bash
    apt-get update
    apt-get install -y openjdk-17-jdk git docker.io docker-compose

    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

    # Start Docker service
    systemctl start docker
    systemctl enable docker

    # Git repository clone with error handling
    git clone https://github.com/redis-field-engineering/redis-sessions-java-dist
    cd redis-sessions-java-dist/samples/bookstore-demo
    ./mvnw -s ./settings.xml clean package
    docker compose up -d
  EOT

}

resource "google_dns_record_set" "app_dns" {
  managed_zone = "${var.dns-zone-name}"
  name         = "bookstore.${var.subdomain}."
  rrdatas      = [google_compute_instance.redis-sessions-java-bookstore-demo-vm.network_interface[0].access_config[0].nat_ip]
  type         = "A"
}