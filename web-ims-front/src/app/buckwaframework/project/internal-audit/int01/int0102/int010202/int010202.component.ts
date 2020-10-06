import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var $ : any ;

@Component({
  selector: 'app-int010202',
  templateUrl: './int010202.component.html',
  styleUrls: ['./int010202.component.css']
})
export class Int010202Component implements OnInit {
  idinspec: any;

  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idinspec = this.route.snapshot.queryParams["id"];
    console.log("idinspec :",this.idinspec);
  }
  ngAfterViewInit(): void {
    $('.menu .item')
    .tab()
  ;
  }
  routeTo() {
    this.router.navigate(['/int07/01/01'], {
      queryParams: {
        id: this.idinspec
      }
    })
  }

  routeToChackLicens() {
    this.router.navigate(['/int06/06'], {
      queryParams: {
        id: this.idinspec
      }
    })
  }

  routeToCheckControlre() {
    this.router.navigate(['/int09/03/03'], {
      queryParams: {
        id: this.idinspec
      }
    })
  }

  routeToCheckTexReceript() {
    this.router.navigate(['/int06/05'], {
      queryParams: {
        id: this.idinspec
      }
    })
  }

  routeTos(route:string) {
    this.router.navigate([`${route}`], {
      queryParams: {
        id: this.idinspec
      }
    })
  }
  
}
